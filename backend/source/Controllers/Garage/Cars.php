<?php

namespace Controllers\Garage;

use Entities\Car;
use Collections\Cars as CarsCollection;
use Controllers\ApiController;

class Cars extends ApiController {

	/**
	 * @route /garage/cars
	 */
	public function index() {

		$this->auth();

		$list = CarsCollection::factory()->find('user = {$user} ORDER BY id', ['user' => $this->user->id]);

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

		/** @var Car $car */
		$car = CarsCollection::factory()->get($this->params->id);

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

		$data = (array)$this->params->car;
		$data['user'] = $this->user->id;

		/** @var Car $car */
		$car = Car::createFromData($data);

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

		/** @var Car $car */
		$car = CarsCollection::factory()->get($this->params->id);

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

		/** @var Car $car */
		$car = CarsCollection::factory()->get($this->params->id);

		$this->checkEntityAccess($car);

		return [
			'deleted' => $car->delete()
		];

	}

}
