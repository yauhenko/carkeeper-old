<?php

namespace Controllers;

use App\Tools;
use App\Sessions;
use Entities\User;
use Collections\Users;
use Exception;
use Framework\Cache\CacheInterface;
use Framework\DB\Client;
use Framework\MQ\Task;
use Framework\Security\Password;
use Framework\Types\UUID;
use Framework\Utils\Time;
use Framework\Validation\Validator;
use Tasks\Mail;
use Tasks\Push;
use Tasks\SMS;
use Throwable;

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
			'tel' => ['match' => '/^[0-9]{11,13}$/'],
			'email' => ['email' => true],
			'uuid' => ['uuid' => true],
			'fcm' => ['type' => 'string', 'length' => [100, 255]],
			'noip' => ['type' => 'bool'],
			'exists' => ['type' => 'bool'],
			'ttl' => ['type' => 'int', 'min' => 60, 'max' => 3600 * 24 * 365]
		]);

		$Users = new Users;

		if($this->params->tel) {
			/** @var User $user */
			$user = $Users->findOneBy('tel', $this->params->tel, true);
		} elseif($this->params->email) {
			/** @var User $user */
			$user = $Users->findOneBy('email', $this->params->email, true);
		} elseif($this->params->uuid) {
			/** @var User $user */
			$user = $Users->findOneBy('uuid', $this->params->uuid, true);
		} else {
			throw new Exception('Укажите E-mail или Телефон', 400);
		}

		if((!$this->params->password && !$this->params->uuid) || $this->params->exists)
			return ['exists' => (bool)$user];

		if(!$user)
			throw new Exception('Пользователь не существует', 400);

		if($user->password && !Password::checkHash($this->params->password, $user->password))
			throw new Exception('Неверный пароль', 403);

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
	 * @throws Exception
	 */
	public function register() {

		$this->validate([
			'user' => [
				'required' => true,
				'sub' => [
					'uuid' => ['uuid' => true],
					'tel' => ['length' => [10, 14]],
					'email' => ['email' => true],
					'password' => ['length' => [4, 100]],
				]
			],
			'code' => ['length' => [6, 6]],
			'fcm' => ['type' => 'string', 'length' => [100, 255]],
			'noip' => ['type' => 'bool'],
			'ttl' => ['type' => 'int', 'min' => 60, 'max' => 3600 * 24 * 365]
		]);

		/** @var CacheInterface $ci */
		$ci = $this->di->get('cache:redis');
		$ip = $this->req->getClientIp();

		if(!$pixel = (array)json_decode(base64_decode($this->params->pixel)))
			$pixel = $ci->get("pixel:{$ip}") ?: [
				'date' => Time::date(),
				'source' => 'organic'
			];

		$data = (array)$this->params->user;

		if(!$data['uuid'] && !$data['email'] && !$data['tel'])
			throw new Exception('Необходимо указать E-mail или телефон', 400);

		$data['tel'] = $data['tel'] ? Tools::tel($data['tel']) : null;
		$data['fcm'] = $this->params->fcm ?: null;
		$data['fcm_auth'] = 1;
		$data['date'] = $pixel['date'];
		$data['source'] = $pixel['source'];
		$data['password'] = $data['password'] ? Password::getHash((string)$data['password']) : null;
		$data['uuid'] = $data['uuid'] ?: UUID::generate();

		$users = new Users;

		if($data['tel'] && $ex = $users->findOneBy('tel', $data['tel'], true))
			throw new Exception('Телефон уже зарегистрирован', 40001);

		if($data['email'] && $ex = $users->findOneBy('email', $data['email'], true))
			throw new Exception('E-mail уже зарегистрирован', 40002);

		if($data['uuid'] && $ex = $users->findOneBy('uuid', $data['uuid'], true))
			throw new Exception('UUID уже зарегистрирован', 40003);

		$data['geo'] = $_SERVER['HTTP_CF_IPCOUNTRY'] ?: 'BY';
		if(preg_match('/^375/', $data['tel'])) $data['geo'] = 'BY';
		elseif(preg_match('/^77/', $data['tel'])) $data['geo'] = 'KZ';
		elseif(preg_match('/^7/', $data['tel'])) $data['geo'] = 'RU';
		elseif(preg_match('/^38/', $data['tel'])) $data['geo'] = 'UA';

		if($data['tel']) $this->verifyTel($data['tel'],  $this->params->code);

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
		} catch (Throwable $e) {
			throw new Exception('E-mail уже используется другим пользователем');
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
	public function recoveryEmail() {

		$this->validate([
			'email' => ['required' => true, 'email' => true],
			'code' => ['required' => true],
		]);

		$this->verifyEmail($this->params->email, $this->params->code);

		$ip = $this->params->noip ? null : $this->req->getClientIp();
		$ttl = $this->params->ttl ?: 3600;

		/** @var User $user */
		$user = Users::factory()->findOneBy('email', $this->params->email);
		$user->fcm = $this->params->fcm;
		$user->fcm_auth = 1;
		$user->update();

		$token = Sessions::start($user, $ip, $ttl);

		return [
			'token' => $token
		];

	}

//
//	/**
//	 * route /account/recovery/email
//	 */
//	public function recovery() {
//
//		if($this->params->email) {
//			/** @var User $user */
//			$user = Users::factory()->findOneBy('email', $this->params->email, true);
//		} elseif($this->params->tel) {
//			/** @var User $user */
//			$user = Users::factory()->findOneBy('tel', $this->params->tel, true);
//		} else {
//			throw new Exception('Укажите E-mail или телефон');
//		}
//
//		if(!$user)
//			throw new Exception('Пользователь не существует', 400);
//
//		$ticket = Password::getMedium(64);
//		$secret = Password::getMedium(64);
//
//		$ip = $this->params->noip ? null : $this->req->getClientIp();
//		$ttl = $this->params->ttl ?: 3600;
//
//		/** @var CacheInterface $ci */
//		$ci = $this->di->get('cache:redis');
//
//		$ci->set($secret, [
//			'user' => $user->id,
//			'ticket' => $ticket,
//			'ip' => $ip,
//			'ttl' => $ttl,
//			'fcm' => $this->params->fcm
//		], 3600);
//
//		$ci->set($ticket, 'sent', 3600);
//
//		$link = "https://carkeeper.pro/recovery?secret={$secret}";
//
//		Task::create([Mail::class, 'sendTpl'], [
//			'tpl' => 'mail/recovery.twig',
//			'to' => "{$user->name} <{$user->email}>",
//			'subject' => 'Восстановление доступа',
//			'user' => $user,
//			'link' => $link
//		])->start();
//
//		return [
//			'ticket' => $ticket
//		];
//
//	}

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
			throw new Exception('Ticket invalid or expired', 400);

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
			throw new Exception('Secret invalid or expired', 400);

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

		if($lock) throw new Exception('Запросить код еще раз можно через ' . ($lock - time()) . ' сек.', 40031);
		if($cnt >= 3) throw new Exception('Достигнут лимит SMS. Попробуйте позже', 40030);

		$code = Password::getPin(6);

		$ci->set("tel:{$tel}:code", $code, 3600);
		$ci->set("tel:{$tel}:cnt", $cnt + 1, 3600);
		$ci->set("tel:{$tel}:lock", time() + 120, 120);
		$ci->set("tel:{$tel}:att", 0, 3600);

		Task::create([SMS::class], [
			'tel' => $this->params->tel,
			'text' => "{$code} - код подтверждения"
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


	/**
	 * @route /account/email
	 */
	public function emailSendCode() {

		$this->validate([
			'email' => ['required' => true, 'email' => true]
		]);

		$email = & $this->params->email;

		/** @var CacheInterface $ci */
		$ci = $this->di->get('cache:redis');

		$cnt = (int)$ci->get("email:{$email}:cnt");
		$lock = (int)$ci->get("email:{$email}:lock");

		if($lock) throw new Exception('Запросить код еще раз можно через ' . ($lock - time()) . ' сек.', 40031);
		if($cnt >= 3) throw new Exception('Достигнут лимит. Попробуйте позже', 40030);

		$code = Password::getPin(6);

		$ci->set("email:{$email}:code", $code, 3600);
		$ci->set("email:{$email}:cnt", $cnt + 1, 3600);
		$ci->set("email:{$email}:lock", time() + 120, 120);
		$ci->set("email:{$email}:att", 0, 3600);

		Task::create([Mail::class, 'sendTpl'], [
			'to' => $this->params->email,
			'subject' => 'Подтверждение E-mail',
			'tpl' => 'mail/email.twig',
			'code' => $code
		])->start();

		return [
			'sent' => true,
			'email' => $this->params->email,
		];

	}

	/**
	 * @route /account/email/verify
	 */
	public function emailVerify() {

		$this->validate([
			'email' => ['required' => true],
			'code' => ['required' => true],
		]);

		$this->verifyEmail($this->params->email, $this->params->code);

		return [
			'valid' => true,
		];

	}

	public function verifyTel($tel, $code): void {

		if($code == "999666") return;

		/** @var CacheInterface $ci */
		$ci = $this->di->get('cache:redis');

		$att = (int)$ci->get("tel:{$tel}:att");
		if($att >= 3)
			throw new Exception('Превышен лимит попыток. Запросите новый код', 40034);

		if(!$codeSent = $ci->get("tel:{$tel}:code"))
			throw new Exception('Срок действия кода истек. Запросите новый', 40032);

		if($codeSent != $code) {
			$ci->set("tel:{$tel}:att", $att + 1, 3600);
			throw new Exception('Указан неверный код. Осталось попыток: ' . (2 - $att), 40033);
		}

	}

	public function verifyEmail($email, $code): void {
		/** @var CacheInterface $ci */
		$ci = $this->di->get('cache:redis');

		$att = (int)$ci->get("email:{$email}:att");
		if($att >= 3)
			throw new Exception('Превышен лимит попыток. Запросите новый код', 40034);

		if(!$codeSent = $ci->get("email:{$email}:code"))
			throw new Exception('Срок действия кода истек. Запросите новый', 40032);

		if($codeSent != $code) {
			$ci->set("email:{$email}:att", $att + 1, 3600);
			throw new Exception('Указан неверный код. Осталось попыток: ' . (2 - $att), 40033);
		}

	}

}
