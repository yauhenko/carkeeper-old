<?php

namespace Controllers;

use App\Sessions;
use Entities\User;
use Collections\Users;
use Framework\DB\Client;
use Framework\Security\Password;

/**
 * Class Auth
 *
 * @package Controllers
 */
class Auth extends BaseController {

	/**
	 * @route /account/login
	 */
	public function login() {

		if(!$this->params->username)
			throw new \Exception('Username is not specified', 400);

		if(!$this->params->password)
			throw new \Exception('Password is not specified', 400);

		$Users = new Users;

		/** @var User $user */
		$user = $Users->findOneBy('username', $this->params->username);

		if(!$user)
			throw new \Exception('User does not exists', 400);

		if(!Password::checkHash($this->params->password, $user->password))
			throw new \Exception('Invalid password', 403);

		$ip = $this->req->getClientIp();
		$ttl = $this->params->ttl ?: 3600;

		$token = Sessions::start($user, $ip, $ttl);

		return [
			'token' => $token,
			'role' => $user->role
		];

	}


	/**
	 * @route /account/logout
	 */
	public function logout() {

		$this->auth();

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

		$data = (array)$this->params->user;

		$data['password'] = Password::getHash($data['password']);
		$data['role'] = 'buyer';

		$user = new User;
		$user->setData($data);
		$user->save();

		$ip = $this->req->getClientIp();
		$ttl = $this->params->ttl ?: 3600;

		$token = Sessions::start($user, $ip, $ttl);

		return [
			'registered' => true,
			'token' => $token,
			'role' => $user->role
		];

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
		return $data;
	}

}
