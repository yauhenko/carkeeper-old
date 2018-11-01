<?php

namespace Entities;

use Collections\Uploads;
use Framework\DB\Entity;

class Upload extends Entity {

	/**
	 * @validate required; uuid
	 * @var string
	 */
	public $id;

	/**
	 * @validate required; type: string; length: 1, 100; match: /\.(jpe?g|png)$/
	 * @var string
	 */
	public $name;

	/**
	 * @validate required; type: string; length: 1, 256
	 * @var string
	 */
	public $path;

	/**
	 * Collection
	 * @var string
	 */
	protected $_collection = Uploads::class;

}
