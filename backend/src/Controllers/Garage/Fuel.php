<?php

namespace Controllers\Garage;

use Entities\Car;
use Framework\DB\Client;
use Controllers\ApiController;
use Collections\Cars as CarsCollection;
use Framework\Utils\Time;

class Fuel extends ApiController {
//
//	/**
//	 * @route /garage/fuel
//	 */
//	public function index() {
//
//		$this->auth();
//
//		$this->validate([
//			'car' => ['required' => true, 'type' => 'int']
//		]);
//
//		/** @var Car $car */
//		$car = CarsCollection::factory()->get($this->params->car);
//
//		$this->checkEntityAccess($car);
//
//		/** @var Client $db */
//		$db = $this->di->db;
//
//		return [
//			'history' => $db->find('SELECT * FROM fuel_history WHERE car = {$car} ORDER BY date ASC', ['car' => $car->id]),
//		];
//
//	}

	/**
	 * @route /garage/fuel/create
	 */
	public function add() {

		$this->validate([
			'car' => ['required' => true, 'type' => 'int'],
			'record' => [
				'required' => true,
				'type' => 'struct',
				'sub' => [
					'odo' => ['required' => true, 'type' => 'int'],
					'amount' => ['required' => true, 'type' => 'int'],
					'price' => ['type' => 'float'],
				]
			]
		]);

		/** @var Car $car */
		$car = CarsCollection::factory()->get($this->params->car);

		$this->checkEntityAccess($car);

		$this->params->record->car = $car->id;
		$this->params->record->date = Time::date();

		/** @var Client $db */
		$db = $this->di->db;

		$id = $db->insert('fuel_history', (array)$this->params->record);

		return [
			'created' => true,
			'id' => $id
		];

	}

}
