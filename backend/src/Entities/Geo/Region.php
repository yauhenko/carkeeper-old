<?php

namespace Entities\Geo;

use Collections\Geo\Regions;
use Framework\DB\Entity;

/**
 * Region Entity
 *
 * @package Entities\Geo
 */
class Region extends Entity {

	/** @var int */
	public $id;

	/** @var string */
	public $name;

	/** @var string */
	protected $_collection = Regions::class;

}
