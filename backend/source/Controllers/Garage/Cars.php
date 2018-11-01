<?php

namespace Controllers\Garage;

use Entities\Car;
use Controllers\ApiController;
use Entities\JournalRecord;
use Framework\Utils\Time;

class Cars extends ApiController {

	/**
	 * @route /garage/cars
	 */
	public function index() {
		$this->auth();

		$cars = new \Collections\Cars;
		$list = $cars->find('user = {$user}', ['user' => $this->user->id]);

		return [
			'cars' => $list,
			'refs' => (object)$this->di->refs->get($list)
		];

	}

	/**
	 * @route /garage/cars/get
	 */
	public function get() {

		$this->auth();

		$this->validate([
			'id' => ['required' => true, 'type' => 'int']
		]);

		$cars = new \Collections\Cars;
		$car = $cars->get($this->params->id);

		return [
			'car' => $car,
			'refs' => (object)$this->di->refs->single($car)
		];

	}

	/**
	 * @route /garage/cars/add
	 */
	public function add() {

		$this->auth();

		$this->validate([
			'car' => [
				'required' => true,
				'sub' => [
					'mark' => ['required' => true, 'type' => 'int'],
					'model' => ['required' => true, 'type' => 'int'],
					'year' => ['required' => true, 'type' => 'int', 'min' => 1990, 'max' => (int)date('Y')],
				]
			]
		]);

		$car = new Car;
		$car->setData((array)$this->params->car);
		$car->user = $this->user->id;
		$car->save();

		return [
			'id' => $car->id
		];

	}

	/**
	 * @route /garage/cars/update
	 */
	public function update() {

		$this->auth();

		$this->validate([
			'id' => ['required' => true, 'type' => 'int'],
			'car' => ['required' => true]
		]);

		$cars = new \Collections\Cars;
		/** @var Car $car */
		$car = $cars->findOneBy('id', $this->params->id);
		$this->checkEntityAccess($car);

		$snapshot = clone $car;

		$car->setData((array)$this->params->car);

		if($car->odo !== $snapshot->odo) {
			$car->odo_mdate = Time::date();
			$record = new JournalRecord;
			$record->user = $car->user;
			$record->car = $car->id;
			$record->type = 'odo';
			$record->odo = $car->odo;
			$record->date = Time::dateTime();
			$record->insert();
		}

		return [
			'updated' => $car->save()
		];

	}

	/**
	 * @route /garage/cars/delete
	 */
	public function delete() {

		$this->auth();

		$this->validate([
			'id' => ['required' => true, 'type' => 'int'],
		]);

		$cars = new \Collections\Cars;
		$car = $cars->get($this->params->id);

		$this->checkEntityAccess($car);

		return [
			'deleted' => $car->delete()
		];

	}

}
