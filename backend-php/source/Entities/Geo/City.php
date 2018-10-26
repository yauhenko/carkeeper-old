<?php

namespace Entities\Geo;

use Collections\Geo\Cities;
use Framework\DB\Entity;

/**
 * City Entity
 *
 * @package Entities\Geo
 */
class City extends Entity {

	/** @var int */
	public $id;

	/** @var string */
	public $name;

	/**
	 * @var int
	 * @ref Entities\Geo\Region
	 */
	public $region;

	/**
	 * @var int
	 * @ref Entities\Geo\District
	 */
	public $district;

	/** @var string */
	public $type;

	/** @var string  */
	protected $_collection = Cities::class;

}
