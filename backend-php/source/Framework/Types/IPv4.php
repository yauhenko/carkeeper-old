<?php

namespace Framework\Types;

use Exception;

/**
 * Class IPv4
 *
 * @package Framework\Types
 */
class IPv4 {

	/**
	 * @var string
	 */
	protected $ip;

	/**
	 * IPv4 constructor
	 *
	 * @param $ip string|int
	 * @throws Exception
	 */
	public function __construct($ip) {
		if(filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
			$this->ip = $ip;
		} elseif(is_long($ip)) {
			$this->ip = long2ip($ip);
		} else {
			throw new Exception('Invalid IPv4: ' . $ip);
		}
	}

	/**
	 * @return string
	 */
	public function __toString(): string {
		return $this->asString();
	}

	/**
	 * Get as string A.B.C.D
	 * @return string
	 */
	public function asString(): string {
		return $this->ip;
	}

	/**
	 * Get as long int
	 *
	 * @return int
	 */
	public function asInt(): int {
		return ip2long($this->ip);
	}

	/**
	 * Check if IP in range
	 *
	 * @param $start IPv4
	 * @param $end IPv4
	 * @return bool
	 */
	public function inRange(IPv4 $start, IPv4 $end): bool {
		$long = $this->asInt();
		return $long >= $start->asInt() && $long <= $end->asInt();
	}

	/**
	 * Check if IP in mask
	 *
	 * @param string $mask
	 * @return bool
	 * @throws Exception
	 */
	public function inMask(string $mask): bool {
		$mask = explode('/', $mask);
		$start = new self($mask[0]);
		$end = new self($start->asInt() + pow(2, 32 - $mask[1]) - 1);
		return $this->inRange($start, $end);
	}

}
