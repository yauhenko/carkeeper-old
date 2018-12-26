<?php

namespace Controllers\Garage;

use Framework\DB\Client;
use Controllers\ApiController;

class Pass extends ApiController {

	/**
	 * @route /garage/pass
	 */
	public function get() {

		//throw new \Exception('Ведутся технические работы. Зайдите попозже');

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
				'lastname' => null,
				'firstname' => null,
				'middlename' => null,
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

		//throw new \Exception('Ведутся технические работы. Зайдите попозже');

		$this->auth();

		$this->validate([
			'car' => ['required' => true, 'type' => 'int'],
			'pass' => [
				'required' => true,
				'type' => 'struct',
				'sub' => [
					'lastname' => ['required' => true, 'type' => 'string', 'length' => [2, 50]],
					'firstname' => ['required' => true, 'type' => 'string', 'length' => [2, 50]],
					'middlename' => ['required' => true, 'type' => 'string', 'length' => [2, 50]],
					'serie' => ['required' => true, 'length' => 3],
					'number' => ['required' => true, 'match' => '/^[0-9]{6,7}$/', 'length' => [6, 7]],
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
