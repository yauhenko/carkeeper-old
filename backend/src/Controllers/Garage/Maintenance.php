<?php

namespace Controllers\Garage;

use Entities\Car;
use Controllers\ApiController;
use Framework\DB\Client;

class Maintenance extends ApiController {

	/** @var Client */
	protected $db;

	public function __construct() {
		parent::__construct();
		$this->db = $this->di->db;
	}

	/**
	 * @route /garage/maintenance
	 */
	public function index() {

		$this->auth();

		$this->validate([
			'car' => ['required' => true, 'type' => 'int']
		]);

		/** @var Car $car */
		$car = \Collections\Cars::factory()->get($this->params->car);
		$this->checkEntityAccess($car);

		$skelled = false;

		fetch:
		$list = $this->db->find('SELECT id, name, distance, period, period_type, last_odo, next_odo, last_date, next_date,
			IF(((next_odo IS NOT NULL AND next_odo <= {$odo}) OR (next_date IS NOT NULL AND next_date <= DATE_FORMAT(NOW(), "%Y-%m-%d"))), "danger", 
				IF(last_odo IS NULL AND last_date IS NULL, "info", "none")) type
			FROM maintenance WHERE user = {$user} AND car = {$car}
			ORDER BY 
				type = "danger" DESC,
				type = "none" DESC,
				next_odo ASC,
				next_date ASC
			', [
			'user' => $this->user->id,
			'car' => $car->id,
			'odo' => $car->odo
		]);

		if(!$list && !$skelled) {
			$skels = $this->db->find('SELECT id, name, distance, period, period_type FROM maintenance_skel 
				WHERE ((fuel IS NULL OR fuel = {$fuel}) OR {$fuel} IS NULL)
				AND ((transmission IS NULL OR transmission = {$transmission}) OR {$transmission} IS NULL)
			', [
				'fuel' => $car->fuel,
				'transmission' => $car->transmission,
			]);
			$this->db->begin();
			foreach ($skels as $skel) {
				$this->db->insert('maintenance', [
					'car' => $car->id,
					'user' => $car->user,
					'skel' => $skel['id'],
					'name' => $skel['name'],
					'distance' => $car->odo_unit === 'km' ? $skel['distance'] : $skel['distance'] / 1.6,
					'period' => $skel['period'],
					'period_type' => $skel['period_type'],
				], true);
			}
			$this->db->commit();
			$skelled = true;
			goto fetch;
		}

		return [
			'list' => $list
		];

	}

	/**
	 * @route /garage/maintenance/create
	 */
	public function create() {

		$this->auth();

		$this->filter([
			'id' => 'int',
			'maintenance' => [
				'car' => 'int',
				'name' => 'string',
				'distance' => 'int',
				'period' => 'int',
				'period_type' => 'string'
			]
		]);

		$this->validate([
			'maintenance' => [
				'required' => true,
				'type' => 'struct',
				'sub' => [
					'car' => ['required' => true, 'type' => 'int'],
					'name' => ['type' => 'string', 'length' => [1, 100]],
					'distance' => ['type' => 'int'],
					'period' => ['type' => 'int'],
					'period_type' => ['required' => true, 'type' => 'string', 'in' => ['month', 'year']],
				]
			]
		]);

		$this->params->maintenance->user = $this->user->id;

		$id = $this->db->insert('maintenance', (array)$this->params->maintenance);

		return [
			'created' => true,
			'id' => $id
		];

	}

	/**
	 * @route /garage/maintenance/get
	 */
	public function get() {

		$this->auth();

		$this->validate([
			'id' => ['required' => true, 'type' => 'int']
		]);

		if(!$item = $this->db->findOneBy('maintenance', 'id', $this->params->id))
			throw new \Exception('Запись не существует', 404);

		$this->checkDataAccess($item);

		return [
			'item' => $item
		];

	}

	/**
	 * @route /garage/maintenance/update
	 */
	public function update() {

		$this->auth();

		$this->filter([
			'id' => 'int',
			'maintenance' => [
				'name' => 'string',
				'distance' => 'int',
				'period' => 'int',
				'period_type' => 'string'
			]
		]);

		$this->validate([
			'id' => ['required' => true, 'type' => 'int'],
			'maintenance' => [
				'required' => true,
				'type' => 'struct',
				'sub' => [
					'name' => ['type' => 'string', 'length' => [1, 100]],
					'distance' => ['type' => 'int'],
					'period' => ['type' => 'int'],
					'period_type' => ['type' => 'string', 'in' => ['month', 'year']],
				]
			]
		]);

		if(!$item = $this->db->findOneBy('maintenance', 'id', $this->params->id))
			throw new \Exception('Запись не существует', 404);

		$this->checkDataAccess($item);

		$item = array_merge($item, (array)$this->params->maintenance);

		$item = self::calcNext($item);

		$res = $this->db->update('maintenance', $item, 'id', $this->params->id);

		return [
			'updated' => $res,
			'item' => $item
		];

	}

	/**
	 * @route /garage/maintenance/delete
	 */
	public function delete() {

		$this->auth();

		$this->validate([
			'id' => ['required' => true, 'type' => 'int'],
		]);

		if(!$item = $this->db->findOneBy('maintenance', 'id', $this->params->id))
			throw new \Exception('Запись не существует', 404);

		$this->checkDataAccess($item);

		$this->db->update('journal', ['title' => $item['name']], 'maintenance', $item['id']);
		$res = $this->db->delete('maintenance', 'id', $this->params->id);

		return [
			'deleted' => $res
		];

	}

	public static function calcNext(array $item): array {

		if($item['last_odo'] && $item['distance']) {
			$item['next_odo'] = $item['last_odo'] + $item['distance'];
		} else {
			$item['next_odo'] = null;
		}

		if($item['last_date'] && $item['period']) {
			$d = new \DateTime($item['last_date']);
			$d->modify('+' . $item['period'] . ' ' . $item['period_type']);
			$item['next_date'] = $d->format('Y-m-d');
		} else {
			$item['next_date'] = null;
		}

		return $item;

	}

}
