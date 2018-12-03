<?php

namespace Controllers\Garage;

use Entities\Car;
use Controllers\ApiController;
use Entities\Journal\Record;
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
		$list = $this->db->find('SELECT id, name, distance, period, period_type, last_odo, next_odo, last_date, next_date 
			FROM maintenance WHERE user = {$user} AND car = {$car}', [
			'user' => $this->user->id,
			'car' => $car->id
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

		$res = $this->db->update('maintenance', $item, 'id', $this->params->id);

		return [
			'updated' => $res,
			'item' => $item
		];

	}

	/**
	 * @route /garage/maintenance/journal
	 */
	public function journal() {

		$this->auth();

		$this->validate([
			'id' => ['required' => true, 'type' => 'int'],
			'odo' => ['required' => true, 'type' => 'int'],
			'date' => ['required' => true, 'date' => 'true'],
		]);

		if(!$item = $this->db->findOneBy('maintenance', 'id', $this->params->id))
			throw new \Exception('Запись не существует', 404);

		$this->checkDataAccess($item);

		$item['last_odo'] = $this->params->odo;
		$item['last_date'] = $this->params->date;

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

		$j = new Record;
		$j->car = $item['car'];
		$j->type = 1; // TODO Remove it
		$j->user = $item['user'];
		$j->date = $this->params->date;
		$j->odo = $this->params->odo;
		$j->maintenance = $this->params->id;
		$j->title = $item['name'];
		$j->insert();

		$res = $this->db->update('maintenance', $item, 'id', $this->params->id);

		return [
			'journaled' => $res,
			'item' => $item,
			'record' => $j->id
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

		$res = $this->db->delete('maintenance', 'id', $this->params->id);

		return [
			'deleted' => $res
		];

	}

}
