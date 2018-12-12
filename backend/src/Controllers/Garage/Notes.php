<?php

namespace Controllers\Garage;

use Entities\Car;
use Entities\Note;
use Controllers\ApiController;
use Collections\Cars as CarsCollection;
use Collections\Notes as NotesCollection;

class Notes extends ApiController {

	/**
	 * @route /garage/notes
	 */
	public function index() {

		$this->auth();

		$this->validate([
			'car' => ['required' => true, 'type' => 'int']
		]);

		/** @var Car $car */
		$car = CarsCollection::factory()->get($this->params->car);

		$this->checkEntityAccess($car);

		$notes = new NotesCollection;
		$list = $notes->getList($car);
		$refs = (object)$this->di->refs->get($list, ['image' => ['table' => 'uploads']]);

		return [
			'notes' => $list,
			'refs' => $refs
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

		/** @var Note $note */
		$note = NotesCollection::factory()->get($this->params->id);

		$this->checkEntityAccess($note);

		return [
			'note' => $note,
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
				'type' => 'struct',
				'sub' => [
					'car' => ['required' => true, 'type' => 'int'],
					'name' => ['required' => true, 'type' => 'string', 'length' => [1, 100]],
					'content' => ['required' => true, 'type' => 'string', 'length' => [1, 20000]],
				]
			]
		]);

		$this->checkAccess('cars', $this->params->note->car);

		$data = (array)$this->params->note;
		$data['user'] = $this->user->id;

		$note = Note::createFromData($data);

		return [
			'created' => true,
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
			'note' => ['required' => true, 'type' => 'struct']
		]);

		/** @var Note $note */
		$note = NotesCollection::factory()->get($this->params->id);

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

		/** @var Note $note */
		$note = NotesCollection::factory()->get($this->params->id);

		$this->checkEntityAccess($note);

		return [
			'deleted' => $note->delete()
		];

	}

}
