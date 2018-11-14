<?php

namespace Entities\Journal;

use Collections\Journal\Types;
use Framework\DB\Entity;

class Type extends Entity {

	/** @var int */
	public $id;

	/**
	 * @rel Entities\Journal\Type
	 * @var int
	 */
	public $pid = null;

	/**
	 * @validate required; type: string; length: 1, 30
	 * @var string
	 */
	public $name;

	/**
	 * @validate type: int
	 * @var int|null
	 */
	public $order = null;

	/** @var string */
	protected $_collection = Types::class;

}
