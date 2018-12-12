<?php

namespace Controllers;

use App\Tools;
use Framework\DB\Client;

class Autocard extends ApiController {

	/**
	 * @route /autocard/check
	 */
	public function check() {

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
		]);

		$this->validate([
			'form' => [
				'required' => true,
				'type' => 'struct',
				'sub' => [
					'firstname' => ['required' => true, 'type' => 'string', 'length' => [2, 50]],
					'lastname' => ['required' => true, 'type' => 'string', 'length' => [2, 50]],
					'tel' => ['required' => true, 'match' => '/^375(25|29|33|44)[0-9]{7}$/'],
				]
			]
		]);

		/** @var Client $db */
		$db = $this->di->db;

		$form = (array)$this->params->form;
		$form['user'] = $this->user->id;

		$id = $db->insert('autocard', $form);

		return [
			'submitted' => true,
			'id' => $id
		];

	}


}
