<?php

namespace Controllers\Garage;

use Entities\Car;
use Controllers\ApiController;
use Collections\Cars as CarsCollection;
use Framework\DB\Client;
use Framework\Patterns\DI;

class FinesRU extends ApiController {

	/** @var Client */
	protected $db;

	public function __construct() {
		parent::__construct();
		$this->auth();
		if($this->user->geo !== 'RU')
			throw new \Exception('Данный раздел недоступен для Вашего региона');
		$this->db = DI::getInstance()->db;
	}

	/**
	 * @route /garage/fines/ru/pass/get
	 */
	public function passGet() {

		$this->validate([
			'id' => ['required' => true, 'type' => 'int'],
		]);

		$car = $this->getCar($this->params->id);

		if(!$pass = $this->db->findOneBy('cars_pass_ru', 'car', $car->id)) {
			$pass = [
				'car' => $car->id,
				'vu' => null,
				'sts' => null,
				'udate' => null
			];
			$this->db->save('cars_pass_ru', $pass);
		}

		return [
			'pass' => $pass
		];

	}

	/**
	 * @route /garage/fines/ru/pass/update
	 */
	public function passUpdate() {

		$this->filter([
			'id' => 'int',
			'pass' => [
				'vu' => 'string',
				'sts' => 'string'
			]
		]);

		$this->validate([
			'id' => ['required' => true, 'type' => 'int'],
			'pass' => [
				'required' => true,
				'type' => 'struct',
				'sub' => [
					'vu' => ['match' => '/^[0-9]{2} [0-9]{2} [0-9]{6}$/'],
					'sts' => ['match' => '/^[0-9]{2} .. [0-9]{6}$/u']
				]
			]
		]);

		$car = $this->getCar($this->params->id);

		$pass = (array)$this->params->pass;
		$pass['car'] = $car->id;

		$res = $this->db->save('cars_pass_ru', $pass);

		return [
			'updated' => $res,
			'pass' => $pass
		];

	}

	/**
	 * @route /garage/fines/ru/index
	 */
	public function index() {

		$this->validate([
			'id' => ['required' => true, 'type' => 'int'],
		]);

		$car = $this->getCar($this->params->id);

		$fines = $this->db->find('SELECT * FROM cars_fines_ru WHERE car = {$car}', ['car' => $car->id]);

		array_walk($fines, function(&$item) {
			$item['raw'] = json_decode($item['raw']);
		});

		return [
			'list' => $fines
		];

	}

	/**
	 * @route /garage/fines/ru/pay
	 */
	public function pay() {

		$this->validate([
			'id' => ['required' => true, 'type' => 'int'],
		]);

	}

	protected function getCar(int $id): Car {
		/** @var Car $car */
		$car = CarsCollection::factory()->get($id);
		$this->checkEntityAccess($car);
		return $car;
	}

}
