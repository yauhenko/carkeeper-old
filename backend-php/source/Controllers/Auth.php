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

		$this->params->tel = Tools::tel($this->params->tel, 375);

		if(!$this->params->tel)
			throw new \Exception('Phone number is not specified', 400);

		if(!$this->params->password)
			throw new \Exception('Password is not specified', 400);

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

		$data = (array)$this->params->user;

		$data['tel'] = Tools::tel($data['tel'], 375);

		print_r($data);

		if(!$data['tel']) throw new \Exception('Empty phone number', 400);
		if(!$data['password']) throw new \Exception('Empty password', 400);

		$data['password'] = Password::getHash($data['password']);
		//$data['role'] = 'buyer';

		$user = new User;
		$user->setData($data);
		$user->save();

		$ip = $this->params->noip ? null : $this->req->getClientIp();
		$ttl = $this->params->ttl ?: 3600;

		$token = Sessions::start($user, $ip, $ttl);

		return [
			'registered' => true,
			'token' => $token,
			//'role' => $user->role
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
