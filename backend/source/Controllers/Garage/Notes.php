<?php

namespace Controllers\Garage;

use Entities\Car;
use Entities\Note;
use Controllers\ApiController;

class Notes extends ApiController {

	/**
	 * @route /garage/notes
	 */
	public function index() {

		$this->auth();

		$this->validate([
			'car' => ['required' => true, 'type' => 'int']
		]);

		$cars = new \Collections\Cars;

		/** @var Car $car */
		$car = $cars->get($this->params->car);

		$this->checkEntityAccess($car);

		$notes = new \Collections\Notes;
		$list = $notes->getList($car);

		return [
			'notes' => $list,
		];

	}

	/**
	 * @route /garage/notes/get
	 */
	public function get() {

		$this->auth();

		$this->validate([
			'id' => ['required' => true, 'type' => 'int']
		]);

		$notes = new \Collections\Notes;
		$note = $notes->get($this->params->id);

		$this->checkEntityAccess($note);

		return [
			'note' => $note,
			//'refs' => (object)$this->di->refs->single($car)
		];

	}

	/**
	 * @route /garage/notes/add
	 */
	public function add() {

		$this->auth();

		$this->validate([
			'note' => [
				'required' => true,
				'sub' => [
					'car' => ['required' => true, 'type' => 'int'],
					'name' => ['required' => true, 'type' => 'string'],
					'content' => ['type' => 'string', 'length' => [1, 20000]],
				]
			]
		]);

		$this->checkAccess('cars', $this->params->note->car);

		$note = new Note;
		$note->setData((array)$this->params->note);
		$note->user = $this->user->id;
		$note->insert();

		return [
			'id' => $note->id
		];

	}

	/**
	 * @route /garage/notes/update
	 */
	public function update() {

		$this->auth();

		$this->validate([
			'id' => ['required' => true, 'type' => 'int'],
			'note' => ['required' => true]
		]);

		$notes = new \Collections\Notes;
		/** @var Note $note */
		$note = $notes->get($this->params->id);
		$this->checkEntityAccess($note);

		$note->setData((array)$this->params->note);

		return [
			'updated' => $note->update()
		];

	}

	/**
	 * @route /garage/notes/delete
	 */
	public function delete() {

		$this->auth();

		$this->validate([
			'id' => ['required' => true, 'type' => 'int'],
		]);

		$notes = new \Collections\Notes;
		$note = $notes->get($this->params->id);

		$this->checkEntityAccess($note);

		return [
			'deleted' => $note->delete()
		];

	}

}
