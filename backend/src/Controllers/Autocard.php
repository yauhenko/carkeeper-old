<?php

namespace Controllers;

use App\Tools;
use Collections\Users;
use Entities\User;
use Framework\Cache\CacheInterface;
use Framework\DB\Client;
use Framework\MQ\Task;
use Framework\Security\Password;
use Framework\Types\UUID;
use Framework\Utils\Time;
use Tasks\SMS;

class Autocard extends ApiController {

	/**
	 * @route /autocard/check
	 */
	public function check() {

		$this->auth();

		/** @var Client $db */
		$db = $this->di->db;

		$application = $db->findOneBy('autocard', 'user', $this->user->id);

		return [
			'application' => $application ?: null,
		];

	}

	/**
	 * @route /autocard/submit
	 */
	public function submit() {

		$this->auth();

		$this->filter([
			'form' => [
				'tel' => [Tools::class, 'tel']
			]
		], false);

		$this->validate([
			'form' => [
				'required' => true,
				'type' => 'struct',
				'sub' => [
					'lastname' => ['required' => true, 'type' => 'string', 'length' => [2, 50]],
					'firstname' => ['required' => true, 'type' => 'string', 'length' => [2, 50]],
					'middlename' => ['required' => true, 'type' => 'string', 'length' => [2, 50]],
					'tel' => ['required' => true, 'match' => '/^375(25|29|33|44)[0-9]{7}$/'],
					'email' => ['type' => 'string', 'length' => [2, 50], 'email' => true],
				]
			]
		]);

		/** @var Client $db */
		$db = $this->di->db;

		$form = (array)$this->params->form;
		$form['user'] = $this->user->id;

		$id = $db->insert('autocard', $form, true);
		if(!$id) throw new \Exception("Заявка с указанным номером телефона уже отправлена");

		\App\Stats::roll((array)$this->user, ['cards' => 1]);

		return [
			'submitted' => true,
			'id' => $id
		];

	}

	/**
	 * @route /autocard/submit2
	 * @throws \Exception
	 */
	public function submit2() {

		$this->filter(['tel' => [Tools::class, 'tel']], false);

		$this->validate([
			'lastname' => ['required' => true, 'length' => [2, 30]],
			'firstname' => ['required' => true, 'length' => [2, 30]],
			'middlename' => ['required' => true, 'length' => [2, 30]],
			'email' => ['email' => true],
			'tel' => ['required' => true, 'match' => '/^375(25|29|33|44)[0-9]{7}$/'],
			'code' => ['required' => true, 'length' => [6, 6]],
		]);

		/** @var CacheInterface $ci */
		$ci = $this->di->get('cache:redis');
		$ip = $this->req->getClientIp();

		if(!$pixel = (array)json_decode(base64_decode($this->params->pixel)))
			$pixel = $ci->get("pixel:{$ip}") ?: [
				'date' => Time::date(),
				'source' => 'organic'
			];

		$password = Password::getPin(6);

		$data = [
			'tel' => $this->params->tel,
			'name' => $this->params->firstname,
			'email' => $this->params->email,
			'password' => Password::getHash($password),
			'date' => $pixel['date'],
			'source' => $pixel['source'],
			'uuid' => UUID::generate()
		];

		$users = new Users;

		if($data['tel'] && $ex = $users->findOneBy('tel', $data['tel'], true))
			throw new \Exception('Телефон уже зарегистрирован', 40001);

		if($data['email'] && $ex = $users->findOneBy('email', $data['email'], true))
			throw new \Exception('E-mail уже зарегистрирован', 40002);

		$data['geo'] = $_SERVER['HTTP_CF_IPCOUNTRY'] ?: 'BY';
		if(preg_match('/^375/', $data['tel'])) $data['geo'] = 'BY';
		elseif(preg_match('/^77/', $data['tel'])) $data['geo'] = 'KZ';
		elseif(preg_match('/^7/', $data['tel'])) $data['geo'] = 'RU';
		elseif(preg_match('/^38/', $data['tel'])) $data['geo'] = 'UA';

		$auth = new Auth;
		$auth->verifyTel($data['tel'],  $this->params->code);

		$user = new User;
		$user->setData($data);
		$user->save();

		/** @var Client $db */
		$db = $this->di->db;
		$id = $db->insert('autocard', [
			'user' => $user->id,
			'status' => 0,
			'firstname' => $this->params->firstname,
			'middlename' => $this->params->middlename,
			'lastname' => $this->params->lastname,
			'tel' => $this->params->tel,
			'email' => $this->params->email,
			'cid' => $this->params->cid ?: 1031
		], true);

		if($id) \App\Stats::roll($user->getData(), ['cards' => 1]);

		Task::create(SMS::class, [
			'tel' => $user->tel,
			'text' => "Проверка штрафов:\nhttps://d.carkeeper.pro\nВаш пароль: {$password}"
		])->start();

		return [
			'success' => true,
		];

	}

	/**
	 * @route /autocard/submit3
	 * @throws \Exception
	 */
	public function submit3() {

		$this->filter(['tel' => [Tools::class, 'tel']], false);

		$this->validate([
			'lastname' => ['required' => true, 'length' => [2, 30]],
			'firstname' => ['required' => true, 'length' => [2, 30]],
			'middlename' => ['required' => true, 'length' => [2, 30]],
			'email' => ['email' => true],
			'tel' => ['required' => true, 'match' => '/^375(25|29|33|44)[0-9]{7}$/'],
			'code' => ['required' => true, 'length' => [6, 6]],
		]);

		/** @var CacheInterface $ci */
		$ci = $this->di->get('cache:redis');
		$ip = $this->req->getClientIp();

		if(!$pixel = (array)json_decode(base64_decode($this->params->pixel)))
			$pixel = $ci->get("pixel:{$ip}") ?: [
				'date' => Time::date(),
				'source' => 'organic'
			];

		$data = [
			'date' => $pixel['date'],
			'source' => $pixel['source'],
		];

		$data['geo'] = $_SERVER['HTTP_CF_IPCOUNTRY'] ?: 'BY';
		if(preg_match('/^375/', $data['tel'])) $data['geo'] = 'BY';
		elseif(preg_match('/^77/', $data['tel'])) $data['geo'] = 'KZ';
		elseif(preg_match('/^7/', $data['tel'])) $data['geo'] = 'RU';
		elseif(preg_match('/^38/', $data['tel'])) $data['geo'] = 'UA';

		$auth = new Auth;
		$auth->verifyTel($this->params->tel,  $this->params->code);

		/** @var Client $db */
		$db = $this->di->db;
		$id = $db->insert('autocard', [
			'user' => null,
			'status' => 0,
			'firstname' => $this->params->firstname,
			'middlename' => $this->params->middlename,
			'lastname' => $this->params->lastname,
			'tel' => $this->params->tel,
			'email' => $this->params->email,
			'cid' => $this->params->cid ?: 1031
		], true);

		if($id) \App\Stats::roll($data, ['cards' => 1]);
		else throw new \Exception('Ваша заявка уже была отправлена в банк', 40055);

		return [
			'success' => true,
		];

	}

}
