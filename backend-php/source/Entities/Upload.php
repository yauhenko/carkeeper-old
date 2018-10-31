<?php

namespace Entities;

use Collections\Uploads;
use Framework\DB\Entity;
use Framework\Types\UUID;

class Upload extends Entity {

	/**
	 * @caption Id
	 * @var string
	 */
	public $id;

	/**
	 * @caption Name
	 * @var string
	 */
	public $name;

	/**
	 * @caption Path
	 * @var string
	 */
	public $path;

	/**
	 * Collection
	 * @var string
	 */
	protected $_collection = Uploads::class;

}
