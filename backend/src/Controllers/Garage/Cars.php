<?php

namespace Controllers\Garage;

use Entities\Car;
use Collections\Cars as CarsCollection;
use Controllers\ApiController;
use Framework\DB\Client;
use Framework\Utils\Time;

class Cars extends ApiController {

	/**
	 * @route /garage/cars
	 */
	public function index() {

		$this->auth();

		$list = CarsCollection::factory()->find('user = {$user} ORDER BY id', ['user' => $this->user->id]);
		$refs = (object)$this->di->refs->get($list);

		/** @var Car $car */
		foreach ($list as &$car) {
			$cnt = 0;
			/** @var CarsCollection $cars */
			$cars = CarsCollection::factory();
			$ns = $cars->getNotifications($car);
			foreach($ns as $n) {
				if($n['level'] === 'warning' || $n['level'] === 'danger') $cnt++;
			}
			$car = $car->getData();
			$car['notifications'] = $cnt;
		}

		return [
			'cars' => $list,
			'refs' => $refs
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

		/** @var \Collections\Cars $cars */
		$cars = CarsCollection::factory();

		/** @var Car $car */
		$car = $cars->get($this->params->id);

		return [
			'car' => $car,
			'refs' => (object)$this->di->refs->single($car),
			'notifications' => $cars->getNotifications($car),
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

		\App\Stats::roll((array)$this->user, ['cars' => 1]);

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

		if($this->params->car->odo) {
			/** @var Client $db */
			$db = $this->di->db;
			$db->save('odo_history', [
				'car' => $car->id,
				'date' => Time::date(),
				'odo' => $car->odo,
			]);
		}

		return [
			'updated' => $car->update()
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
