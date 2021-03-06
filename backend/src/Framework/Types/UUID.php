<?php

namespace Framework\Types;

use Exception;

/**
 * Class UUID
 *
 * @package Framework\Types
 */
class UUID {

	public const GENERATOR_INTERNAL	= 1;
	public const GENERATOR_LINUX	= 2;

	/**
	 * @var string
	 */
	protected $uuid;

	/**
	 * UUID constructor
	 *
	 * @param string|null $uuid
	 * @param int $generator
	 * @throws Exception
	 */
	public function __construct(string $uuid = null, int $generator = self::GENERATOR_INTERNAL) {
		start:

		# generating new
		if($uuid === null) {
			$this->uuid = self::generate($generator);
			return;

		# from String
		} elseif(strlen($uuid) == 36 && preg_match('/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i', $uuid)) {
			$this->uuid = $uuid;
			return;

		# from Hex
		} elseif(strlen($uuid) == 32 && preg_match('/^([0-9A-F]{8})([0-9A-F]{4})(4[0-9A-F]{3})([89AB][0-9A-F]{3})([0-9A-F]{12})$/i', $uuid, $m)) {
			unset($m[0]);
			$this->uuid = implode('-', $m);

		# from Binary
		} elseif(strlen($uuid) == 16) {
			$uuid = unpack('h*', $uuid)[1];
			goto start;

		# Invalid UUID
		} else {
			throw new Exception('Invalid UUID: ' . $uuid);
		}

	}

	/**
	 * Get as HEX
	 *
	 * @return string
	 */
	public function asHex(): string {
		return str_replace('-', '', $this->uuid);
	}

	/**
	 * Get as string
	 *
	 * @return string
	 */
	public function asString(): string {
		return $this->uuid;
	}

	/**
	 * Get as binary
	 *
	 * @return string
	 */
	public function asBinary(): string {
		return pack('h*', str_replace('-', '', $this->uuid));
	}

	/**
	 * @return string
	 */
	public function __toString(): string {
		return $this->uuid;
	}

	/**
	 * Generate UUID
	 *
	 * @param int $generator
	 * @return string
	 * @throws Exception
	 */
	public static function generate(int $generator = self::GENERATOR_INTERNAL): string {

		if($generator == self::GENERATOR_INTERNAL)
			return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
				mt_rand(0, 0xffff), mt_rand(0, 0xffff),
				mt_rand(0, 0xffff),
				mt_rand(0, 0x0fff) | 0x4000,
				mt_rand(0, 0x3fff) | 0x8000,
				mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
			);

		elseif($generator == self::GENERATOR_LINUX)
			return trim(file_get_contents('/proc/sys/kernel/random/uuid'));


		throw new Exception('Unknown generator');

	}

	/**
	 * Validate UUID
	 *
	 * @param string $uuid
	 * @return bool
	 */
	public static function validate(string $uuid): bool {
		return preg_match('/^[0-9A-F]{8}-?[0-9A-F]{4}-?4[0-9A-F]{3}-?[89AB][0-9A-F]{3}-?[0-9A-F]{12}$/i', $uuid);
	}

}
