<?php

namespace Controllers\Garage;

use Controllers\ApiController;
use Entities\JournalRecord;

class Journal extends ApiController {

	/**
	 * @route /garage/journal
	 */
	public function index() {
		$this->auth();

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

		if(!$record)
			throw new \Exception('Record not found', 404);

		if($this->user->id !== $record->user)
			throw new \Exception('Access denied', 403);

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

		if(!$record)
			throw new \Exception('Record not found', 404);

		if($this->user->id !== $record->user)
			throw new \Exception('Access denied', 403);

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

		if(!$record)
			throw new \Exception('Record not found', 404);

		if($this->user->id !== $record->user)
			throw new \Exception('Access denied', 403);

		return [
			'deleted' => $record->delete()
		];

	}

}
