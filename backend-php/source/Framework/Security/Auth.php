<?php

namespace Framework\Security;

use Framework\DB\Client;
use Framework\MVC\AbstractController;
use Framework\Patterns\DI;

class Auth {

	protected $auth = [];

	public function __construct(array $auth) {
		$this->auth = $auth;
	}

	public function authenticate(AbstractController $controller, string $method): int {

		$class = get_class($controller);
		if($props = $this->auth[$class][$method]) {

			/** @var Session $sess */
			$sess = DI::getInstance()->session;

			if(!$sess->user) return 401;

			/** @var Client $db */
			$db = DI::getInstance()->db;

			$sess->user = $db->findOneBy('users', 'id', $sess->user['id']);
			unset($sess->user['password']);

			if($sess->user['role'] === 'admin') return 0;

			if($props['acl'] && !in_array($props['acl'], (array)$sess->user['acl'])) return 403;
			if($props['role'] && !in_array($sess->user['role'], $props['role'])) return 403;

		}

		return 0;

	}

}
