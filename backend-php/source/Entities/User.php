<?php

namespace Entities;

use Collections\Users;
use Framework\DB\Entity;

class User extends Entity {

	/**
	 * @caption Id
	 * @required
	 * @var int|null
	 */
	public $id;

	/**
	 * @caption Role
	 * @validate required; in: seller, buyer, admin
	 * @var string
	 */
	public $role;

	/**
	 * @caption Mobile phone
	 * @validate match: /^375(25|29|33|44)[0-9]{7}$/
	 * @var int
	 */
	public $tel;

	/**
	 * @caption E-mail
	 * @validate email
	 * @var string
	 */
	public $email;

	/** @var string */
	public $username;

	/** @var string */
	public $password;

	/** @var string */
	public $name;

	/**
	 * @caption Avatar
	 * @ref Entities\Upload
	 * @var string|null
	 */
	public $avatar = null;

	/** @var string */
	protected $_collection = Users::class;

}
