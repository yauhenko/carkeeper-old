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

		$cars = new \Collections\Cars;
		$car = $cars->findOneBy('id', $this->params->id);

		if(!$car)
			throw new \Exception('Car not found', 404);

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

		return ['id' => $car->id];

	}

	/**
	 * @route /garage/cars/update
	 */
	public function update() {
		$this->auth();

		$cars = new \Collections\Cars;
		$car = $cars->findOneBy('id', $this->params->id);

		if(!$car)
			throw new \Exception('Car not found', 404);

		if($this->user->id !== $car->user)
			throw new \Exception('Access denied', 403);

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

		$cars = new \Collections\Cars;
		$car = $cars->findOneBy('id', $this->params->id);

		if(!$car)
			throw new \Exception('Car not found', 404);

		if($this->user->id !== $car->user)
			throw new \Exception('Access denied', 403);

		return [
			'deleted' => $car->delete()
		];

	}

}
