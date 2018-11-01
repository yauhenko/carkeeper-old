<?php

namespace Collections\Geo;

use Entities\Geo\Region;
use Framework\DB\Collection;

/**
 * Class Regions
 *
 * @package Collections
 */
class Regions extends Collection {

	/**
	 * Table
	 *
	 * @var string
	 */
	protected $_table = 'geo_regions';

	/**
	 * Entity
	 *
	 * @var string
	 */
	protected $_entity = Region::class;

}
