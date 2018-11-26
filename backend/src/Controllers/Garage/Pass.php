<?php

namespace Controllers\Garage;

use Framework\DB\Client;
use Controllers\ApiController;

class Pass extends ApiController {

	/**
	 * @route /garage/pass
	 */
	public function get() {

		$this->auth();

		$this->validate([
			'car' => ['required' => true, 'type' => 'int']
		]);

		$this->checkAccess('cars', $this->params->car);

		/** @var Client $db */
		$db = $this->di->db;

		$item = $db->findOneBy('cars_pass', 'car', $this->params->car);
		if(!$item) {
			$item = [
				'firstname' => null,
				'middlename' => null,
				'lastname' => null,
				'serie' => null,
				'number' => null,
			];
		}

		unset($item['car'], $item['udate']);

		return [
			'pass' => $item
		];
	}

	/**
	 * @route /garage/pass/update
	 */
	public function update() {

		$this->auth();

		$this->validate([
			'car' => ['required' => true, 'type' => 'int'],
			'pass' => [
				'required' => true,
				'type' => 'struct',
				'sub' => [
					'firstname' => ['required' => true, 'type' => 'string', 'length' => [2, 50]],
					'middlename' => ['required' => true, 'type' => 'string', 'length' => [2, 50]],
					'lastname' => ['required' => true, 'type' => 'string', 'length' => [2, 50]],
					'serie' => ['required' => true, 'length' => 3],
					'number' => ['required' => true, 'length' => 6],
				]
			]
		]);

		$this->checkAccess('cars', $this->params->car);

		$this->params->pass->car = $this->params->car;

		/** @var Client $db */
		$db = $this->di->db;
		$res = $db->save('cars_pass', (array)$this->params->pass);

		return [
			'updated' => $res
		];

	}

}
