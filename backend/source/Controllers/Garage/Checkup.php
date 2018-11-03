<?php

namespace Controllers\Garage;

use Framework\DB\Client;
use Controllers\ApiController;

class Checkup extends ApiController {

	/**
	 * @route /garage/checkup
	 */
	public function index() {

		$this->auth();

		$this->validate([
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

		return [
			'checkup' => $item
		];

	}

	/**
	 * @route /garage/checkup/update
	 */
	public function update() {

		$this->auth();

		$this->validate([
			'car' => ['required' => true, 'type' => 'int'],
			'checkup' => [
				'required' => true,
				'type' => 'struct',
				'sub' => [
					'notify' => ['required' => true, 'type' => 'bool'],
					'edate' => ['date' => true],
				]
			]
		]);

		$this->checkAccess('cars', $this->params->car);

		/** @var Client $db */
		$db = $this->di->db;

		$res = $db->update('cars_checkup', (array)$this->params->checkup, 'car', $this->params->car);

		return [
			'updated' => $res
		];

	}

}
