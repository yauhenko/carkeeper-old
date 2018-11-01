<?php

namespace Controllers\Garage;

use Controllers\ApiController;
use Entities\JournalRecord;
use Framework\Validation\Validator;

class Journal extends ApiController {

	/**
	 * @route /garage/journal
	 */
	public function index() {

		$this->auth();

		Validator::validateData($this->params, [
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

		$journal = new \Collections\Journal();
		$record = $journal->findOneBy('id', $this->params->id);

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

		$record = new JournalRecord;
		$record->setData((array)$this->params->record);
		$record->user = $this->user->id;
		$record->save();

		return ['id' => $record->id];

	}

	/**
	 * @route /garage/journal/update
	 */
	public function update() {
		$this->auth();

		$journal = new \Collections\Journal;
		$record = $journal->findOneBy('id', $this->params->id);

		$this->checkEntityAccess($record);

		$record->setData((array)$this->params->record);

		return [
			'updated' => $record->save()
		];

	}

	/**
	 * @route /garage/journal/delete
	 */
	public function delete() {
		$this->auth();

		$journal = new \Collections\Journal();
		$record = $journal->findOneBy('id', $this->params->id);

		$this->checkEntityAccess($record);

		return [
			'deleted' => $record->delete()
		];

	}

}
