<?php

namespace Entities;

use Collections\Users;
use Framework\DB\Entity;

class User extends Entity {

	/**
	 * @var int|null
	 */
	public $id;

	/**
	 * @var bool
	 */
	public $active = true;

	/**
	 * @validate required; match: /^[0-9]+$/
	 * @var int
	 */
	public $tel;

	/**
	 * @validate email
	 * @var string
	 */
	public $email;

	/**
	 * @var string|null
	 */
	public $username = null;

	/**
	 * @validate required
	 * @var string
	 */
	public $password;

	/**
	 * @validate length: 2, 30
	 * @var string
	 */
	public $name;

	/**
	 * @validate uuid
	 * @ref Entities\Upload
	 * @var string|null
	 */
	public $avatar = null;

	/**
	 * @validate type: string; length: 2, 2
	 * @var string|null
	 */
	public $geo = null;

	/**
	 * @validate type: int
	 * @ref Entities\Geo\City
	 * @var int|null
	 */
	public $city = null;

	/**
	 * @validate type: string; length: 100, 255
	 * @var string|null
	 */
	public $fcm = null;

	/** @var string */
	protected $_collection = Users::class;

}
