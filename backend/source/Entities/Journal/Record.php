<?php

namespace Entities\Journal;

use Collections\Journal\Journal;
use Framework\DB\Entity;

class Record extends Entity {

	/**
	 * @var int
	 */
	public $id;

	/**
	 * @validate required; type: int
	 * @ref Entities\User
     * @var int
	 */
	public $user;

	/**
	 * @validate required; type: int
	 * @ref Entities\Car
     * @var int
	 */
	public $car;

	/**
	 * @validate date
	 * @var string|null
	 */
	public $date = null;

	/**
	 * @validate type: int
     * @var int|null
	 */
	public $odo = null;

	/**
	 * @validate required; type: int
	 * @ref Entities\Journal\Type
     * @var string
	 */
	public $type;

	/**
	 * @validate length: 1, 255
     * @var string|null
	 */
	public $comment = null;

	/**
	 * @validate uuid
	 * @ref Entities\Upload
	 * @var string|null
	 */
	public $image = null;

	/** @var string */
	protected $_collection = Journal::class;

}