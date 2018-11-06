<?php

namespace Controllers\Garage;

use Entities\Car;
use Entities\Journal\Record;
use Controllers\ApiController;
use Collections\Cars as CarsCollection;
use Collections\Journal\Journal as JournalCollection;
use Framework\DB\Client;
use Framework\Utils\Time;

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
			'refs' => (object)$this->di->refs->get($records)
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
			'refs' => (object)$this->di->refs->single($record)
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
					'type' => ['required' => true, 'type' => 'int'],
					'date' => ['required' => true, 'date' => true],
					'odo' => ['type' => 'int', 'min' => 0, 'max' => 10000000],
					'comment' => ['type' => 'string', 'length' => [1, 255]],
					'image' => ['uuid' => true],
				]
			]
		]);

		$this->checkAccess('cars', $this->params->record->car);

		$data = (array)$this->params->record;
		$data['user'] = $this->user->id;
		$record = Record::createFromData($data);

		if($record->odo) {
			/** @var Car $car */
			$car = CarsCollection::factory()->get($this->params->record->car);
			if($record->odo > $car->odo) {
				$car->odo = $record->odo;
				$car->odo_mdate = Time::date();
				$car->save();
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
			'record' => ['required' => true]
		]);

		/** @var Record $record */
		$record = JournalCollection::factory()->get($this->params->id);

		$this->checkEntityAccess($record);

		$record->setData((array)$this->params->record);

		return [
			'updated' => $record->update()
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

		return [
			'deleted' => $record->delete()
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
