<?php

namespace Collections;

use Entities\Car;
use Framework\DB\Collection;

/**
 * Cars collection
 *
 * @package Collections
 */
class Cars extends Collection {

	/**
	 * @var string
	 */
	protected $_table = 'cars';

	/**
	 * @var string
	 */
	protected $_entity = Car::class;

}
