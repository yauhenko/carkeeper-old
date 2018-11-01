<?php

namespace Entities;

use Collections\Journal;
use Framework\DB\Entity;

class JournalRecord extends Entity {

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
	 * @validate datetime
	 * @var string|null
	 */
	public $date = null;

	/**
	 * @validate type: int
     * @var int|null
	 */
	public $odo = null;

	/**
	 * @validate required; type: string; length: 1, 20
     * @var string
	 */
	public $type = 'other';

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
