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
	 * @validate required; type: int
	 * @var int
	 */
	public $mark;

	/**
	 * @validate required; type: int
	 * @var int
	 */
	public $model;

	/**
	 * @validate required; type: int; min: 1980; max: 2019
	 * @var int
	 */
	public $year;

	/**
	 * @validate type: int
	 * @var int|null
	 */
	public $generation = null;

	/**
	 * @validate type: int
	 * @var int|null
	 */
	public $serie = null;

	/**
	 * @validate type: int
	 * @var int|null
	 */
	public $modification = null;

	/**
	 * @validate uuid
	 * @rel Entities\Upload
	 * @var string|null
	 */
	public $image = null;

	/**
	 * @validate type: int
	 * @var int|null
	 */
	public $odo = null;

	/**
	 * @validate required; in: km, m
	 * @var string
	 */
	public $odo_unit = 'km';

	/**
	 * @validate date
	 * @var string|null
	 */
	public $odo_mdate = null;

	/** @var string */
	protected $_collection = Cars::class;

}
