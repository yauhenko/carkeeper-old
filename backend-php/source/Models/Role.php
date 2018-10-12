<?php

namespace Models;

use Framework\DB\Record;

class Role extends Record {

	protected $_table = 'roles';

	protected $_name = 'Role';

	protected $_fields = [

		'id' => [
			'public' => true
		],

		'name' => [
		    'name' => 'Логин',
			'public' => true,
            'create' => true
		],

    ];

}
