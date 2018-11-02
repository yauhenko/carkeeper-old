<?php

namespace Collections;

use Entities\Car;
use Entities\Fine;
use Framework\DB\Collection;

/**
 * Fines collection
 *
 * @package Collections
 */
class Fines extends Collection {

	/**
	 * @var string
	 */
	protected $_table = 'cars_fines';

	/**
	 * @var string
	 */
	protected $_entity = Fine::class;

	public function getList(Car $car): array {
		$list = $this->find('car = {$car} ORDER BY id DESC', [
			'car' => $car->id
		]);
		return $list;
	}

}
