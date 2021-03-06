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
	 * @validate uuid
	 * @var string|null
	 */
	public $uuid;

	/**
	 * @var bool
	 */
	public $active = true;

	/**
	 * @validate match: /^[0-9]{11,13}$/
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

	public $fcm_auth = 1;

	public $date;

	public $source;

	/** @var string */
	protected $_collection = Users::class;

}
