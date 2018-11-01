<?php

namespace Controllers\Garage;

use Entities\JournalRecord;
use Controllers\ApiController;
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

		$journal = new \Collections\Journal;
		$records = $journal->find('user = {$user} AND car = {$car} ORDER BY `date` DESC, `id` DESC', [
			'user' => $this->user->id,
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

		$journal = new \Collections\Journal();
		$record = $journal->get($this->params->id);

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
			'id' => ['required' => true, 'type' => 'int'],
			'record' => [
				'required' => true,
				'sub' => [
					'car' => ['required' => true, 'type' => 'int'],
					'date' => ['required' => true, 'datetime' => true],
					'odo' => ['type' => 'int', 'min' => 0, 'max' => 1000000],
					'type' => ['required' => true, 'type' => 'string', 'length' => [1, 20]],
					'comment' => ['type' => 'string', 'length' => [1, 255]],
					'image' => ['uuid' => true],
				]
			]
		]);

		$this->checkAccess('cars', $this->params->record->car);

		$record = new JournalRecord;
		$record->setData((array)$this->params->record);
		$record->user = $this->user->id;
		$record->insert();

		if($record->type === 'odo' && $record->odo) {
			/** @var Client $db */
			$db = $this->di->db;
			$db->update('cars', [
				'odo' => $record->odo,
				'mdate' => Time::dateTime()
			], 'id', $record->car);
		}

		return ['id' => $record->id];

	}

	/**
	 * @route /garage/journal/update
	 */
	public function update() {

		$this->auth();

		$this->validate([
			'id' => ['required' => true, 'type' => 'int'],
			'record' => [
				'required' => true,
				'sub' => [
					'car' => ['required' => true, 'type' => 'int'],
					'date' => ['required' => true, 'datetime' => true],
					'odo' => ['type' => 'int', 'min' => 0, 'max' => 1000000],
					'type' => ['required' => true, 'type' => 'string', 'length' => [1, 20]],
					'comment' => ['type' => 'string', 'length' => [1, 255]],
					'image' => ['uuid' => true],
				]
			]
		]);

		$journal = new \Collections\Journal;
		/** @var JournalRecord $record */
		$record = $journal->get($this->params->id);
		$this->checkEntityAccess($record);
		$record->setData((array)$this->params->record);

		if($record->type === 'odo' && $record->odo) {
			/** @var Client $db */
			$db = $this->di->db;
			$db->update('cars', [
				'odo' => $record->odo,
				'mdate' => Time::dateTime()
			], 'id', $record->car);
		}

		return [
			'updated' => $record->save()
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

		$journal = new \Collections\Journal();
		$record = $journal->get($this->params->id);
		$this->checkEntityAccess($record);

		return [
			'deleted' => $record->delete()
		];

	}

}
