<?php

namespace Controllers;

use App\Tools;
use App\Sessions;
use Entities\User;
use Collections\Users;
use Framework\DB\Client;
use Framework\MQ\Task;
use Framework\Security\Password;
use Framework\Validation\Validator;
use Tasks\Mail;
use Tasks\Push;

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

		Validator::validateData($this->params, [
			'tel' => ['required' => true],
			'password' => ['required' => true],
			'fcm' => ['type' => 'string', 'length' => [100, 255]],
			'noip' => ['type' => 'bool'],
			'ttl' => ['type' => 'int', 'min' => 60, 'max' => 3600 * 24 * 365]
		]);

		$this->params->tel = Tools::tel($this->params->tel, 375);

		$Users = new Users;

		/** @var User $user */
		$user = $Users->findOneBy('tel', $this->params->tel);

		if(!$user)
			throw new \Exception('Пользователь не существует', 400);

		if(!Password::checkHash($this->params->password, $user->password))
			throw new \Exception('Неверный пароль', 403);

		if($this->params->fcm) {
			$user->fcm = $this->params->fcm;
			$user->save();
		}

		Task::create(Push::class, [
			'user' => $user->id,
			'title' => 'CarKeeper',
			'message' => 'Добро пожаловать!'
		])->start();

		Task::create([Mail::class, 'send'], [
			'to' => "{$user->name} <{$user->email}>",
			'subj' => 'Добро пожаловать',
			'html' => "<p>Привет, {$user->name}</p>"
		])->start();

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
		$this->user->fcm = null;
		$this->user->save();
		/** @var Client $db */
		$db = $this->di->db;
		$db->delete('sessions', 'token', $this->params->token);
		return true;
	}

	/**
	 * @route /account/register
	 * @throws \Exception
	 */
	public function register() {
		Validator::validateData($this->params, [
			'user' => [
				'required' => true,
				'sub' => [
					'tel' => ['required' => true],
				]
			],
			'fcm' => ['type' => 'string', 'length' => [100, 255]],
			'noip' => ['type' => 'bool'],
			'ttl' => ['type' => 'int', 'min' => 60, 'max' => 3600 * 24 * 365]
		]);

		$data = (array)$this->params->user;
		$data['tel'] = Tools::tel($data['tel'], 375);
		$data['password'] = Password::getHash((string)$data['password']);

		$users = new Users;
		if($ex = $users->findOneBy('tel', $data['tel']))
			throw new \Exception('Телефон уже зарегистрирован', 40001);

		if($ex = $users->findOneBy('email', $data['email']))
			throw new \Exception('E-mail уже зарегистрирован', 40002);

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
		$this->user->setData($update);
		return $this->user->save();
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
		return 'pong';
	}

}
