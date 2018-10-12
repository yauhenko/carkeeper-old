<?php

namespace Models;

use Framework\DB\Collection;

class Accounts extends Collection {

	protected $_table = 'users';
	protected $_entity = Account::class;

}
