<?php

namespace Collections\Geo;

use Entities\Geo\City;
use Framework\DB\Collection;

/**
 * Class Cities
 *
 * @package Collections
 */
class Cities extends Collection {

	/**
	 * Table
	 *
	 * @var string
	 */
	protected $_table = 'geo_cities';

	/**
	 * Entity
	 *
	 * @var string
	 */
	protected $_entity = City::class;

}
