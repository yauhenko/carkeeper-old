<?php

namespace Controllers;

use Entities\User;
use Collections\Users;
use Framework\DB\Client;
use Framework\Utils\Time;
use Framework\Security\Password;
use Symfony\Component\HttpFoundation\Response;

class Auth extends BaseController {

	/**
	 * @route /account/login
	 */
	public function login(): Response {

		if(!$this->params->username) return $this->jsonError('Username is not specified', 400);
		if(!$this->params->password) return $this->jsonError('Password is not specified', 400);

		$ttl = $this->params->ttl ?: 3600;

		$Users = new Users;

		/** @var User $user */
		$user = $Users->findOneBy('username', $this->params->username);

		if(!$user)
			return $this->jsonError('User does not exists', 400);

		if(!Password::checkHash($this->params->password, $user->password))
			return $this->jsonError('Invalid password', 403);

		$token = Password::getMedium(64);

		/** @var Client $db */
		$db = $this->di->db;

		$db->insert('sessions', [
			'token' => $token,
			'user' => $user->id,
			'edate' => Time::dateTimeOffset($ttl),
			'ip' => $this->params->noip ? null : $this->req->getClientIp()
		]);

		return $this->jsonResult(['token' => $token, 'role' => $user->role]);

	}

	/**
	 * @route /account/logout
	 */
	public function logout(): Response {

		$this->auth();

		/** @var Client $db */
		$db = $this->di->db;

		$db->delete('sessions', 'token', $this->params->token);

		return $this->jsonResult(true);

	}

	/**
	 * @route /account/register
	 * @return Response
	 * @throws \Exception
	 */
	public function register(): Response {

		$data = (array)$this->params->user;

		$data['password'] = Password::getHash($data['password']);
		$data['role'] = 'buyer';

		$user = new User;
		$user->setData($data);
		$user->save();

		$ttl = $this->params->ttl ?: 3600;

		$token = Password::getMedium(64);

		/** @var Client $db */
		$db = $this->di->db;

		$db->insert('sessions', [
			'token' => $token,
			'user' => $user->id,
			'edate' => Time::dateTimeOffset($ttl),
			'ip' => $this->params->noip ? null : $this->req->getClientIp()
		]);

		return $this->jsonResult(['registered' => true, 'token' => $token, 'role' => $user->role]);

	}

	/**
	 * @route /account/info
	 */
	public function info(): Response {
		$this->auth();
		$data = $this->user->getData();
		unset($data['password']);
		return $this->jsonResult($data);
	}

}
