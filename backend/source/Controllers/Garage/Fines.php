<?php

namespace Controllers\Garage;

use Entities\Car;
use Entities\Fine;
use Controllers\ApiController;

class Fines extends ApiController {

	/**
	 * @route /garage/fines
	 */
	public function index() {

		$this->auth();

		$this->validate([
			'car' => ['required' => true, 'type' => 'int']
		]);

		$cars = new \Collections\Cars;

		/** @var Car $car */
		$car = $cars->get($this->params->car);

		$this->checkEntityAccess($car);

		$fines = new \Collections\Fines;
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

		$fines = new \Collections\Fines;

		/** @var Fine $fine */
		$fine = $fines->get($this->params->id);

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

		$fines = new \Collections\Fines;

		/** @var Fine $fine */
		$fine = $fines->get($this->params->id);

		$this->checkEntityAccess($fine);

		return [
			'deleted' => $fine->delete()
		];

	}

}
