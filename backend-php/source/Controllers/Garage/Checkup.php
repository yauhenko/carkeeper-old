<?php

namespace Controllers\Garage;

use Controllers\ApiController;
use Framework\DB\Client;
use Framework\Validation\Validator;

class Checkup extends ApiController {

	/**
	 * @route /garage/checkup
	 */
	public function index() {

		$this->auth();

		Validator::validateData($this->params, [
			'car' => ['required' => true, 'type' => 'int']
		]);

		$this->checkAccess('cars', $this->params->car);

		/** @var Client $db */
		$db = $this->di->db;

		$item = $db->findOne('SELECT * FROM cars_checkup WHERE car = {$car}', ['car' => $this->params->car]);
		if(!$item) {
			$item = [
				'notify' => false,
				'edate' => null,
				'car' => $this->params->car
			];
			$db->insert('cars_checkup', $item);
		}

		unset($item['car']);
		$item['notify'] = (bool)$item['notify'];

		return $item;
	}

	/**
	 * @route /garage/checkup/update
	 */
	public function update() {

		$this->auth();

		Validator::validateData($this->params, [
			'car' => ['required' => true, 'type' => 'int'],
			'checkup' => [
				'required' => true,
				'sub' => [
					'notify' => ['required' => true, 'type' => 'bool'],
					'edate' => ['date' => true],
				]
			]
		]);

		$this->checkAccess('cars', $this->params->car);

		/** @var Client $db */
		$db = $this->di->db;
		return $db->update('cars_checkup', (array)$this->params->checkup, 'car', $this->params->car);

	}

}
