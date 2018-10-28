<?php

namespace Entities;

use Collections\Journal;
use Framework\DB\Entity;

class JournalRecord extends Entity {

	/**
	 * @var int
	 */
	public $id;

	/** @var int */
	public $user;

	/** @var int */
	public $car;

	/** @var string|null */
	public $date = null;

	/** @var int|null */
	public $odo = null;

	/** @var string */
	public $type = 'other';

	/** @var string|null  */
	public $comment = null;

	/**
	 * @ref Entities\Upload
	 * @var string|null
	 */
	public $image = null;

	/** @var string */
	protected $_collection = Journal::class;

}
