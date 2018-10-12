<?php

namespace Models;

use Framework\DB\Entity;

class Account extends Entity {

	# Public

	/**
	 * @title Идентификатор
	 * @validate {"type": "numeric", "min": 10; "max": 20}
	 * @required
	 * @var int|null
	 */
	public $id;

	/** @var string */
	public $username;

	/** @var string */
	public $password;

	/** @var string */
	public $name;

	protected $_collection = Accounts::class;

}
