<?php

namespace Models;

use Framework\DB\Record;

class User extends Record {

	protected $_table = 'users';
	protected $_name = 'User';

	protected $_fields = [

		'id' => [
			'public' => true
		],

		'username' => [
		    'name' => 'Логин',
			'public' => true,
            'create' => true
		],

        'password' => [
            'name' => 'Пароль',
            'create' => true,
            'update' => true,
        ],

        'name' => [
            'name' => 'Имя',
            'public' => true,
            'create' => true,
            'update' => true,
        ],

        'role' => [
            'name' => 'Роль',
            'public' => true,
            'create' => true,
            'update' => true,
            //'ref' => Role::class
        ],

    ];

	protected function onGetName($name): string {
	    return "**{$name}***";
    }

    protected function onSetPassword(string $password): string {
	    return md5($password);
    }

}
