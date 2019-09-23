<?php

namespace App;

use Collections\Users;
use Entities\User;
use Exception;
use Framework\DB\Client;
use Framework\Patterns\DI;
use Framework\Security\Password;
use Framework\Utils\Time;

/**
 * Class Sessions
 *
 * @package App
 */
class Sessions {

	/**
	 * Start session for User
	 *
	 * @param User $user
	 * @param string|null $ip
	 * @param int $ttl
	 * @return string
	 * @throws Exception
	 */
	public static function start(User $user, string $ip = null, int $ttl = 3600): string {

		$token = Password::getMedium(64);

		/** @var Client $db */
		$db = DI::getInstance()->db;

		$db->insert('sessions', [
			'token' => $token,
			'user' => $user->id,
			'edate' => Time::dateTimeOffset($ttl),
			'ttl' => $ttl,
			'ip' => $ip
		]);

		return $token;

	}

	/**
	 * Get User session by token
	 *
	 * @param string $token
	 * @param string $ip
	 * @return User|null
	 * @throws Exception
	 */
	public static function get(string $token, string $ip): ?User {

		$Users = new Users;

		$entity = $Users->findOne('SELECT u.* FROM sessions s
			INNER JOIN users u ON u.id = s.user AND s.token = {$token}
			WHERE u.active = 1 AND s.edate > NOW()
			AND (s.ip IS NULL OR s.ip = {$ip})
		', ['token' => $token, 'ip' => $ip], true);

		if($entity) {

			/** @var Client $db */
			$db = DI::getInstance()->db;
			$db->query('UPDATE sessions SET edate = DATE_ADD(NOW(), INTERVAL `ttl` SECOND) WHERE token = {$token}',
				['token' => $token]);

			$user = new User;
			$user->assign($entity);
			return $user;
		}

		return null;

	}

	/**
	 * Destroy session by token
	 *
	 * @param string $token
	 * @return bool
	 * @throws Exception
	 */
	public static function destroy(string $token): bool {
		/** @var Client $db */
		$db = DI::getInstance()->db;
		return $db->delete('sessions', 'token', $token);
	}

	/**
	 * Destroy expired sessions
	 *
	 * @throws Exception
	 */
	public static function cleanup(): void {
		/** @var Client $db */
		$db = DI::getInstance()->db;
		$db->query('DELETE FROM sessions WHERE edate < NOW()');
	}

}
