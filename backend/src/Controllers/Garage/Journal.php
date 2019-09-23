<?php

namespace Controllers\Garage;

use Entities\Car;
use Entities\Journal\Record;
use Controllers\ApiController;
use Collections\Journal\Journal as JournalCollection;
use Exception;
use Framework\DB\Client;

class Journal extends ApiController {

	/**
	 * @route /garage/journal
	 */
	public function index() {

		$this->auth();

		$this->validate([
			'car' => ['required' => true, 'type' => 'int']
		]);

		$this->checkAccess('cars', $this->params->car);

		$records = JournalCollection::factory()->find('car = {$car} ORDER BY `date` DESC, `id` DESC', [
			'car' => $this->params->car
		]);

		return [
			'records' => $records,
			'refs' => (object)$this->di->refs->get($records, [
				'image' => ['table' => 'uploads'],
				'maintenance' => ['table' => 'maintenance'],
			])
		];

	}

	/**
	 * @route /garage/journal/get
	 */
	public function get() {

		$this->auth();

		$this->validate([
			'id' => ['required' => true, 'type' => 'int']
		]);

		$record = JournalCollection::factory()->get($this->params->id);

		$this->checkEntityAccess($record);

		return [
			'record' => $record,
			'refs' => (object)$this->di->refs->single($record, [
				'image' => ['table' => 'uploads'],
				'maintenance' => ['table' => 'maintenance'],
			])
		];

	}

	/**
	 * @route /garage/journal/add
	 */
	public function add() {

		$this->auth();

		$this->validate([
			'record' => [
				'required' => true,
				'type' => 'struct',
				'sub' => [
					'car' => ['required' => true, 'type' => 'int'],
					'type' => ['type' => 'int'],
					'maintenance' => ['type' => 'int'],
					'date' => ['required' => true, 'date' => true],
					'odo' => ['type' => 'int', 'min' => 0, 'max' => 10000000],
					'title' => ['type' => 'string', 'length' => [1, 100]],
					'comment' => ['type' => 'string', 'length' => [1, 255]],
					'image' => ['uuid' => true],
				]
			]
		]);

		$this->checkAccess('cars', $this->params->record->car);

		$data = (array)$this->params->record;
		$data['user'] = $this->user->id;

		if(!$data['maintenance'] && !$data['title'])
			throw new Exception('Укажите название или тип записи');

		$record = Record::createFromData($data);

		if($record->maintenance) {
			/** @var Client $db */
			$db = $this->di->db;
			$last = $db->findOne('SELECT id, odo, date FROM journal WHERE maintenance = {$maintenance} 
				ORDER BY odo DESC, date DESC LIMIT 1', [
				'maintenance' => $record->maintenance,
			]);
			if($last) {
				$item = $db->findOneBy('maintenance', 'id', $record->maintenance);
				$item['last_odo'] = $last['odo'];
				$item['last_date'] = $last['date'];
				$item = Maintenance::calcNext($item);
				$db->update('maintenance', $item, 'id', $record->maintenance);
			}
		}

		return [
			'created' => true,
			'id' => $record->id
		];

	}

	/**
	 * @route /garage/journal/update
	 */
	public function update() {

		$this->auth();

		$this->validate([
			'id' => ['required' => true, 'type' => 'int'],
			'record' => ['required' => true, 'type' => 'struct']
		]);

		/** @var Record $record */
		$record = JournalCollection::factory()->get($this->params->id);

		$this->checkEntityAccess($record);

		$record->setData((array)$this->params->record);

		if(!$record->maintenance && !$record->title)
			throw new Exception('Укажите название или тип записи');

		$res = $record->update();

		if($record->maintenance) {
			/** @var Client $db */
			$db = $this->di->db;
			$last = $db->findOne('SELECT id, odo, date FROM journal WHERE maintenance = {$maintenance} 
				ORDER BY odo DESC, date DESC LIMIT 1', [
				'maintenance' => $record->maintenance,
			]);
			if($last) {
				$item = $db->findOneBy('maintenance', 'id', $record->maintenance);
				$item['last_odo'] = $last['odo'];
				$item['last_date'] = $last['date'];
				$item = Maintenance::calcNext($item);
				$db->update('maintenance', $item, 'id', $record->maintenance);
			}
		}

		return [
			'updated' => $res
		];

	}

	/**
	 * @route /garage/journal/delete
	 */
	public function delete() {

		$this->auth();

		$this->validate([
			'id' => ['required' => true, 'type' => 'int']
		]);

		/** @var Record $record */
		$record = JournalCollection::factory()->get($this->params->id);

		$this->checkEntityAccess($record);

		/** @var Car $car */
		$car = \Collections\Cars::factory()->get($record->car);

		$res = $record->delete();

		if($record->maintenance) {
			/** @var Client $db */
			$db = $this->di->db;

			$last = $db->findOne('SELECT id, odo, date FROM journal WHERE maintenance = {$maintenance} 
				ORDER BY odo DESC, date DESC LIMIT 1', [
				'maintenance' => $record->maintenance,
			]);

			if($last) {
				$item = $db->findOneBy('maintenance', 'id', $record->maintenance);
				$item['last_odo'] = $last['odo'];
				$item['last_date'] = $last['date'];
				$item = Maintenance::calcNext($item);
				$db->update('maintenance', $item, 'id', $record->maintenance);
			} else {
				$item = [
					'last_odo' => 0,
					'last_date' => $car->year . '-01-01',
				];
				$item = Maintenance::calcNext($item);
				$db->update('maintenance', $item, 'id', $record->maintenance);
			}

		}

		return [
			'deleted' => $res
		];

	}

	/**
	 * @route /garage/journal/types
	 */
	public function types() {

		/** @var Client $db */
		$db = $this->di->db;

		$types = $db->query('SELECT id, name FROM journal_types ORDER BY `order` ASC, name');
		//$types = Types::factory()->find('TRUE ORDER BY `order` ASC');

		return [
			'types' => $types
		];

	}

}
