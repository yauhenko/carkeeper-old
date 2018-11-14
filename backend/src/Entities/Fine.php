<?php

namespace Entities;

use Collections\Fines;
use Framework\DB\Entity;

class Fine extends Entity {

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
	 * @validate required; type: int
	 * @var int
	 */
	public $regid;

	/**
	 * @validate datetime
	 * @var string|null
	 */
	public $cdate = null;

	/**
	 * @validate required; datetime
	 * @var string|null
	 */
	public $rdate = null;

	/**
	 * @validate required; type: int; in: [0, 1]
	 * @var int
	 */
	public $status = 0;

	/**
	 * @validate required; type: float
	 * @var float|null
	 */
	public $amount = null;

	/** @var string */
	protected $_collection = Fines::class;

}
