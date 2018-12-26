<?php

namespace Controllers;

use App\Tools;
use Framework\DB\Client;

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
					'firstname' => ['required' => true, 'type' => 'string', 'length' => [2, 50]],
					'middlename' => ['required' => true, 'type' => 'string', 'length' => [2, 50]],
					'lastname' => ['required' => true, 'type' => 'string', 'length' => [2, 50]],
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

		return [
			'submitted' => true,
			'id' => $id
		];

	}


}
