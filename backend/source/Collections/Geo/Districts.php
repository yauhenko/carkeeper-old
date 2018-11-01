<?php

namespace Collections\Geo;

use Entities\Geo\District;
use Framework\DB\Collection;

/**
 * Class Districts
 *
 * @package Collections
 */
class Districts extends Collection {

	/**
	 * Table
	 *
	 * @var string
	 */
	protected $_table = 'geo_districts';

	/**
	 * Entity
	 *
	 * @var string
	 */
	protected $_entity = District::class;

}
