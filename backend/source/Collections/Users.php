<?php

namespace Collections;

use Entities\User;
use Framework\DB\Collection;

/**
 * Class Users
 * @package Collections
 */
class Users extends Collection {

	/**
	 * @var string
	 */
	protected $_table = 'users';
	/**
	 * @var string
	 */
	protected $_entity = User::class;

}
