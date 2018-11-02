<?php

namespace Collections;

use Entities\Car;
use Entities\Note;
use Framework\DB\Collection;

/**
 * Notes collection
 *
 * @package Collections
 */
class Notes extends Collection {

	/**
	 * @var string
	 */
	protected $_table = 'cars_notes';

	/**
	 * @var string
	 */
	protected $_entity = Note::class;

	public function getList(Car $car): array {
		$list = $this->find('car = {$car} ORDER BY id', [
			'car' => $car->id
		]);
		return $list;
	}

}
