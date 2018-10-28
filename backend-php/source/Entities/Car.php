<?php

namespace Entities;

use Collections\Cars;
use Framework\DB\Entity;

class Car extends Entity {

	/** @var int */
	public $id;

	/**
	 * @rel Entities\User
	 * @var int
	 */
	public $user;

	/**
	 * @var int
	 */
	public $mark;

	/**
	 * @var int
	 */
	public $model;

	/**
	 * @var int
	 */
	public $year;

	/**
	 * @var int|null
	 */
	public $generation = null;

	/**
	 * @var int|null
	 */
	public $serie = null;

	/**
	 * @var int|null
	 */
	public $modification = null;

	/**
	 * @rel Entities\Upload
	 * @var string|null
	 */
	public $image = null;

	/** @var string */
	protected $_collection = Cars::class;

}
