<?php

namespace Entities;

use Collections\Notes;
use Framework\DB\Entity;

class Note extends Entity {

	/** @var int */
	public $id;

	/**
	 * @rel Entities\User
	 * @var int
	 */
	public $user;

	/**
	 * @rel Entities\Car
	 * @var int
	 */
	public $car;

	/**
	 * @validate required; type: string; length: 1, 100
	 * @var string
	 */
	public $name;

	/**
	 * @validate type: string; length: 0, 20000
	 * @var string
	 */
	public $content = null;

	/** @var string */
	protected $_collection = Notes::class;

}
