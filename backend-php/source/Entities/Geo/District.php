<?php

namespace Entities\Geo;

use Collections\Geo\Districts;
use Framework\DB\Entity;

/**
 * District Entity
 *
 * @package Entities\Geo
 */
class District extends Entity {

	/** @var int */
	public $id;

	/** @var string */
	public $name;

	/**
	 * @var int
	 * @ref Entities\Geo\Region
	 */
	public $region;

	/** @var string  */
	protected $_collection = Districts::class;

}
