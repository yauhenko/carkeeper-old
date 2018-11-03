<?php

namespace Controllers\Garage;

use Entities\Car;
use Controllers\ApiController;

class Cars extends ApiController {

	/**
	 * @route /garage/cars
	 */
	public function index() {
		$this->auth();

		$cars = new \Collections\Cars;
		$list = $cars->find('user = {$user} ORDER BY id', ['user' => $this->user->id]);

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

		/** @var Car $car */
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
				'type' => 'struct',
				'sub' => [
					'mark' => ['required' => true, 'type' => 'int'],
					'model' => ['required' => true, 'type' => 'int'],
					'year' => ['required' => true, 'type' => 'int', 'min' => 1980, 'max' => (int)date('Y')],
				]
			]
		]);

		$car = new Car;
		$car->setData((array)$this->params->car);
		$car->user = $this->user->id;
		$car->save();

		return [
			'created' => true,
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
			'car' => ['required' => true, 'type' => 'struct']
		]);

		$cars = new \Collections\Cars;

		/** @var Car $car */
		$car = $cars->findOneBy('id', $this->params->id);

		$this->checkEntityAccess($car);

		$car->setData((array)$this->params->car);

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

		/** @var Car $car */
		$car = $cars->get($this->params->id);

		$this->checkEntityAccess($car);

		return [
			'deleted' => $car->delete()
		];

	}

}
