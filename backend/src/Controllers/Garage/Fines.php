<?php

namespace Controllers\Garage;

use Entities\Car;
use Entities\Fine;
use Controllers\ApiController;
use Collections\Cars as CarsCollection;
use Collections\Fines as FinesCollection;

class Fines extends ApiController {

	/**
	 * @route /garage/fines
	 */
	public function index() {

		$this->auth();

		$this->validate([
			'car' => ['required' => true, 'type' => 'int']
		]);

		/** @var Car $car */
		$car = CarsCollection::factory()->get($this->params->car);

		$this->checkEntityAccess($car);

		$fines = new FinesCollection;
		$list = $fines->getList($car);

		return [
			'fines' => $list,
		];

	}

	/**
	 * @route /garage/fines/pay
	 */
	public function pay() {

		$this->auth();

		$this->validate([
			'id' => ['required' => true, 'type' => 'int'],
		]);

		/** @var Fine $fine */
		$fine = FinesCollection::factory()->get($this->params->id);

		$this->checkEntityAccess($fine);

		$fine->status = 1;

		return [
			'paid' => $fine->update()
		];

	}

	/**
	 * @route /garage/fines/delete
	 */
	public function delete() {

		$this->auth();

		$this->validate([
			'id' => ['required' => true, 'type' => 'int'],
		]);

		/** @var Fine $fine */
		$fine = FinesCollection::factory()->get($this->params->id);

		$this->checkEntityAccess($fine);

		return [
			'deleted' => $fine->delete()
		];

	}

}
