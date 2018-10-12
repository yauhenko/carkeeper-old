<?php

namespace Collections;

use Entities\User;
use Framework\DB\Collection;

class Users extends Collection {

	protected $_table = 'users';
	protected $_entity = User::class;

}
