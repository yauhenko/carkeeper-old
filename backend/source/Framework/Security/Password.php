<?php

namespace Framework\Security;

/**
 * Class Password
 *
 * @package Framework\Security
 */
class Password {

	/**
	 * Get PIN
	 *
	 * @param int $length
	 * @return string
	 */
	public static function getPin(int $length = 4): string {
		return self::generate($length, true, false, false);
	}

	/**
	 * Get Simple Password
	 *
	 * @param int $length
	 * @return string
	 */
	public static function getSimple(int $length = 6): string {
		return self::generate($length, true, false, false);
	}

	/**
	 * Get Medium Password
	 *
	 * @param int $length
	 * @return string
	 */
	public static function getMedium(int $length = 8): string {
		return self::generate($length, true, true, false);
	}

	/**
	 * Get Strong Password
	 * @param int $length
	 * @return string
	 */
	public static function getStrong(int $length = 16): string {
		return self::generate($length, true, true, true);
	}

	/**
	 * Generate Password
	 *
	 * @param int $length
	 * @param bool $numbers
	 * @param bool $letters
	 * @param bool $special
	 * @return string
	 */
	public static function generate(int $length, bool $numbers, bool $letters, bool $special): string {
		$charset = '';
		if($numbers) $charset .= '0123456789';
		if($letters) $charset .= 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		if($special) $charset .= ' !"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~';
		return self::fromCharset($length, $charset);
	}

	/**
	 * Generate Password from set of chars
	 * @param int $length
	 * @param string $charset
	 * @return string
	 */
	public static function fromCharset(int $length, string $charset): string {
		$count = mb_strlen($charset);
		for($i = 0, $result = ''; $i < $length; $i++) {
			$index = mt_rand(0, $count - 1);
			$result .= mb_substr($charset, $index, 1);
		}
		return $result;
	}

	/**
	 * Get Password salted Hash
	 *
	 * @param string $password
	 * @return string
	 */
	public static function getHash(string $password): string {
		return password_hash($password, PASSWORD_DEFAULT);
	}

	/**
	 * Check Password
	 *
	 * @param string $password
	 * @param string $hash
	 * @return bool
	 */
	public static function checkHash(string $password, string $hash): bool {
		return password_verify($password, $hash);
	}

}
