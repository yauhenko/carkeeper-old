<?php

namespace Controllers;

use App\Tools;
use App\Sessions;
use Entities\User;
use Collections\Users;
use Framework\Cache\CacheInterface;
use Framework\DB\Client;
use Framework\MQ\Task;
use Framework\Security\Password;
use Framework\Validation\Validator;
use Tasks\Mail;
use Tasks\Push;
use Tasks\SMS;

/**
 * Class Auth
 *
 * @package Controllers
 */
class Auth extends ApiController {

	/**
	 * @route /account/login
	 */
	public function login() {

		$this->filter(['tel' => [Tools::class, 'tel']], false);

		$this->validate([
			'tel' => ['required' => true, 'match' => '/^[0-9]{11,13}$/'],
			'fcm' => ['type' => 'string', 'length' => [100, 255]],
			'noip' => ['type' => 'bool'],
			'ttl' => ['type' => 'int', 'min' => 60, 'max' => 3600 * 24 * 365]
		]);

		$Users = new Users;

		/** @var User $user */
		$user = $Users->findOneBy('tel', $this->params->tel, true);

		if(!$this->params->password)
			return ['exists' => (bool)$user];

		if(!$user)
			throw new \Exception('Пользователь не существует', 400);

		if(!Password::checkHash($this->params->password, $user->password))
			throw new \Exception('Неверный пароль', 403);

		if($this->params->fcm) {
			$user->fcm = $this->params->fcm;
			$user->fcm_auth = 1;
			$user->save();
		}

		$ip = $this->params->noip ? null : $this->req->getClientIp();
		$ttl = $this->params->ttl ?: 3600;

		$token = Sessions::start($user, $ip, $ttl);

		return [
			'token' => $token
		];

	}

	/**
	 * @route /account/logout
	 */
	public function logout() {
		$this->auth();
		$this->user->fcm_auth = 0;
		$this->user->save();
		/** @var Client $db */
		$db = $this->di->db;
		$token = $this->req->headers->get('Token') ?: $this->params->token;
		$db->delete('sessions', 'token', $token);
		return true;
	}

	/**
	 * @route /account/register
	 * @throws \Exception
	 */
	public function register() {

		$this->validate([
			'user' => [
				'required' => true,
				'sub' => [
					'tel' => ['required' => true],
					'password' => ['required' => true],
				]
			],
			'code' => ['required' => true],
			'fcm' => ['type' => 'string', 'length' => [100, 255]],
			'noip' => ['type' => 'bool'],
			'ttl' => ['type' => 'int', 'min' => 60, 'max' => 3600 * 24 * 365]
		]);

		$data = (array)$this->params->user;
		$data['tel'] = Tools::tel($data['tel']);
		$data['fcm'] = $this->params->fcm ?: null;
		$data['fcm_auth'] = 1;
		$data['password'] = Password::getHash((string)$data['password']);

		$users = new Users;
		if($ex = $users->findOneBy('tel', $data['tel'], true))
			throw new \Exception('Телефон уже зарегистрирован', 40001);

		if($ex = $users->findOneBy('email', $data['email'], true))
			throw new \Exception('E-mail уже зарегистрирован', 40002);

		$data['geo'] = $_SERVER['HTTP_CF_IPCOUNTRY'] ?: 'BY';
		if(preg_match('/^375/', $data['tel'])) $data['geo'] = 'BY';
		elseif(preg_match('/^77/', $data['tel'])) $data['geo'] = 'KZ';
		elseif(preg_match('/^7/', $data['tel'])) $data['geo'] = 'RU';
		elseif(preg_match('/^38/', $data['tel'])) $data['geo'] = 'UA';

		$this->verifyTel($data['tel'],  $this->params->code);

		$user = new User;
		$user->setData($data);
		$user->save();

		$ip = $this->params->noip ? null : $this->req->getClientIp();
		$ttl = $this->params->ttl ?: 3600;

		$token = Sessions::start($user, $ip, $ttl);

		return [
			'registered' => true,
			'token' => $token,
		];

	}

	/**
	 * Update profile
	 *
	 * @route /account/update
	 */
	public function update() {
		$this->auth();
		Validator::validateData($this->params, [
			'user' => ['required' => true]
		]);
		$update = (array)$this->params->user;
		if($update['password']) $update['password'] = Password::getHash($update['password']);

		if($this->user->tel) unset($update['tel']);
		if($this->user->email) unset($update['email']);

		$this->user->setData($update);

		try {
			$res = $this->user->save();
		} catch (\Throwable $e) {
			throw new \Exception('E-mail уже используется другим пользователем');
		}

		return $res;
	}

	/**
	 * Get info
	 *
	 * @route /account/info
	 */
	public function info() {
		$this->auth();
		$data = $this->user->getData();

		unset($data['password']);

		return [
			'user' => $data,
			'refs' => (object)$this->di->refs->single($this->user)
		];

	}

	/**
	 * Ping
	 *
	 * @route /account/ping
	 */
	public function ping() {
		$this->auth();
		if($fcm = $this->params->fcm) {
			if($fcm !== $this->user->fcm) {
				$this->user->fcm = $fcm;
				$this->user->save();
			}
		}
		return 'pong';
	}

	/**
	 * @route /account/recovery/email
	 */
	public function recovery() {

		if($this->params->email) {
			/** @var User $user */
			$user = Users::factory()->findOneBy('email', $this->params->email, true);
		} elseif($this->params->tel) {
			/** @var User $user */
			$user = Users::factory()->findOneBy('tel', $this->params->tel, true);
		} else {
			throw new \Exception('Укажите E-mail или телефон');
		}

		if(!$user)
			throw new \Exception('Пользователь не существует', 400);

		$ticket = Password::getMedium(64);
		$secret = Password::getMedium(64);

		$ip = $this->params->noip ? null : $this->req->getClientIp();
		$ttl = $this->params->ttl ?: 3600;

		/** @var CacheInterface $ci */
		$ci = $this->di->get('cache:redis');

		$ci->set($secret, [
			'user' => $user->id,
			'ticket' => $ticket,
			'ip' => $ip,
			'ttl' => $ttl,
			'fcm' => $this->params->fcm
		], 3600);

		$ci->set($ticket, 'sent', 3600);

		$link = "https://carkeeper.pro/recovery?secret={$secret}";

		Task::create([Mail::class, 'sendTpl'], [
			'tpl' => 'mail/recovery.twig',
			'to' => "{$user->name} <{$user->email}>",
			'subject' => 'Восстановление доступа',
			'user' => $user,
			'link' => $link
		])->start();

		return [
			'ticket' => $ticket
		];

	}

	/**
	 * @route /account/recovery/email/ticket
	 */
	public function recoveryTicket() {

		$this->validate([
			'ticket' => ['required' => true, 'type' => 'string', 'length' => [64, 64]]
		]);

		/** @var CacheInterface $ci */
		$ci = $this->di->get('cache:redis');

		if(!$token = $ci->get($this->params->ticket))
			throw new \Exception('Ticket invalid or expired', 400);

		if($token === 'sent') return ['status' => 'wait'];

		return [
			'token' => $token
		];

	}

	/**
	 * @route /account/recovery/email/secret
	 */
	public function recoverySecret() {

		$this->validate([
			'secret' => ['required' => true, 'type' => 'string', 'length' => [64, 64]]
		]);

		/** @var CacheInterface $ci */
		$ci = $this->di->get('cache:redis');

		if(!$recovery = $ci->get($this->params->secret))
			throw new \Exception('Secret invalid or expired', 400);

		$ip = $this->params->noip ? null : $this->req->getClientIp();
		$ttl = $this->params->ttl ?: 3600;

		/** @var User $user */
		$user = Users::factory()->get($recovery['user']);
		$user->fcm = $recovery['fcm'];
		$user->fcm_auth = 1;
		$user->update();

		$token = Sessions::start($user, $ip, $ttl);

		$ci->set($recovery['ticket'], $token, 3600);

		Task::create([Push::class], [
			'fcm' => $user->fcm,
			'title' => 'CarKeeper',
			'body' => 'Доступ к приложению восстановлен',
			'extra' => [
				'type' => 'recovery',
				'token' => $token
			]
		])->start();

		return [
			'token' => $token
		];

	}

	/**
	 * @route /account/recovery/tel
	 */
	public function recoveryTel() {

		$this->filter(['tel' => [Tools::class, 'tel']], false);

		$this->validate([
			'tel' => ['required' => true],
			'code' => ['required' => true],
		]);

		$this->verifyTel($this->params->tel, $this->params->code);

		$ip = $this->params->noip ? null : $this->req->getClientIp();
		$ttl = $this->params->ttl ?: 3600;

		/** @var User $user */
		$user = Users::factory()->findOneBy('tel', $this->params->tel);
		$user->fcm = $this->params->fcm;
		$user->fcm_auth = 1;
		$user->update();

		$token = Sessions::start($user, $ip, $ttl);

		return [
			'token' => $token
		];

	}


	/**
	 * @route /feedback
	 */
	public function feedback() {

		$this->auth();

		$this->validate([
			'subject' => ['required' => true],
			'message' => ['required' => true],
		]);

		Task::create([Mail::class, 'sendTpl'], [
			'tpl' => 'mail/feedback.twig',
			'to' => 'kirienkov@gmail.com, imbalance777@gmail.com',
			'subject' => $this->params->subject,
			'message' => $this->params->message,
			'user' => $this->user
		])->start();

		return [
			'sent' => true
		];

	}

	/**
	 * @route /account/geo
	 */
	public function geo() {
		$code = $_SERVER['HTTP_CF_IPCOUNTRY'] ?: 'BY';
		$geos = json_decode(file_get_contents($this->di->root . '/data/geos.json'), true);
		return (array)$geos[$code] + ['code' => $code];
	}

	/**
	 * @route /account/tel
	 */
	public function telSendCode() {

		$this->filter(['tel' => [Tools::class, 'tel']], false);

		$this->validate([
			'tel' => ['required' => true]
		]);

		$tel = & $this->params->tel;

		/** @var CacheInterface $ci */
		$ci = $this->di->get('cache:redis');

		$cnt = (int)$ci->get("tel:{$tel}:cnt");
		$lock = (int)$ci->get("tel:{$tel}:lock");

		if($lock) throw new \Exception('Запросить код еще раз можно через ' . ($lock - time()) . ' сек.', 40031);
		if($cnt >= 3) throw new \Exception('Достигнут лимит SMS. Попробуйте позже', 40030);

		$code = Password::getPin(6);

		$ci->set("tel:{$tel}:code", $code, 3600);
		$ci->set("tel:{$tel}:cnt", $cnt + 1, 3600);
		$ci->set("tel:{$tel}:lock", time() + 120, 120);
		$ci->set("tel:{$tel}:att", 0, 3600);

		Task::create([SMS::class], [
			'tel' => $this->params->tel,
			'text' => "Код подтверждения для CarKeeper: {$code}"
		])->start();

		return [
			'sent' => true,
			'tel' => $this->params->tel,
		];

	}

	/**
	 * @route /account/tel/verify
	 */
	public function telVerify() {

		$this->filter(['tel' => [Tools::class, 'tel']], false);

		$this->validate([
			'tel' => ['required' => true],
			'code' => ['required' => true],
		]);

		$this->verifyTel($this->params->tel, $this->params->code);

		return [
			'valid' => true,
		];
	}

	public function verifyTel($tel, $code): void {
		/** @var CacheInterface $ci */
		$ci = $this->di->get('cache:redis');

		$att = (int)$ci->get("tel:{$tel}:att");
		if($att >= 3)
			throw new \Exception('Превышен лимит попыток. Запросите новый код', 40034);

		if(!$codeSent = $ci->get("tel:{$tel}:code"))
			throw new \Exception('Срок действия кода истек. Запросите новый', 40032);

		if($codeSent != $code) {
			$ci->set("tel:{$tel}:att", $att + 1, 3600);
			throw new \Exception('Указан неверный код. Осталось попыток: ' . (2 - $att), 40033);
		}

	}

}
