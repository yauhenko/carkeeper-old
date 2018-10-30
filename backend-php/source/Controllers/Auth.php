<?php

namespace Controllers;

use App\Sessions;
use App\Tools;
use Entities\Geo\City;
use Entities\Geo\District;
use Entities\Geo\Region;
use Entities\User;
use Collections\Users;
use Framework\DB\Client;
use Framework\Security\Password;
use Framework\Validation\Validator;

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
			'fcm' => ['type' => 'string', 'length' => [50, 100]],
			'noip' => ['type' => 'bool'],
			'ttl' => ['type' => 'int', 'min' => 60, 'max' => 3600 * 24 * 365]
		]);

		$this->params->tel = Tools::tel($this->params->tel, 375);

		$Users = new Users;

		/** @var User $user */
		$user = $Users->findOneBy('tel', $this->params->tel);

		if(!$user)
			throw new \Exception('User does not exists', 400);

		if(!Password::checkHash($this->params->password, $user->password))
			throw new \Exception('Invalid password', 403);

		if($this->params->fcm) {
			$user->fcm = $this->params->fcm;
			$user->save();
		}

		$ip = $this->params->noip ? null : $this->req->getClientIp();
		$ttl = $this->params->ttl ?: 3600;

		$token = Sessions::start($user, $ip, $ttl);

		return [
			'token' => $token,
			//'role' => $user->role
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
					'tel' => ['required' => true, 'match' => '/^375(25|29|33|44)[0-9]{7}$/'],
					'password' => ['required' => true, 'type' => 'string', 'length' => [6, 50]],
					'name' => ['required' => true, 'type' => 'string', 'length' => [2, 20]],
					'email' => ['required' => true, 'type' => 'string', 'filter' => 'email', 'length' => [2, 20]],
				]
			],
			'fcm' => ['type' => 'string', 'length' => [50, 100]],
			'noip' => ['type' => 'bool'],
			'ttl' => ['type' => 'int', 'min' => 60, 'max' => 3600 * 24 * 365]
		]);

		$data = (array)$this->params->user;
		$data['tel'] = Tools::tel($data['tel'], 375);
		$data['password'] = Password::getHash($data['password']);

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

		/** @var City|null $city */
		if($city = $this->user->ref('city')) {
			/** @var District|null $district */
			$district = $city->ref('district');
			/** @var Region|null $district */
			$region = $city->ref('region');
			$data['region'] = $region->getData();
			$data['district'] = $district->getData();
			$data['city'] = $city->getData();
		}

		unset($data['password']);
		return $data;
	}

}
