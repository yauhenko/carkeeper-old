<?php

namespace Framework\Types;

use Exception;

class IPv4 {

	protected $ip;

	public function __construct($ip) {
		if(filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
			$this->ip = $ip;
		} elseif(is_long($ip)) {
			$this->ip = long2ip($ip);
		} else {
			throw new Exception('Invalid IPv4: ' . $ip);
		}
	}

	public function __toString(): string {
		return $this->asString();
	}

	public function asString(): string {
		return $this->ip;
	}

	public function asInt(): int {
		return ip2long($this->ip);
	}

	public function inRange(self $start, self $end): bool {
		$long = $this->asInt();
		return $long >= $start->asInt() && $long <= $end->asInt();
	}

	public function inMask(string $mask): bool {
		$mask = explode('/', $mask);
		$start = new self($mask[0]);
		$end = new self($start->asInt() + pow(2, 32 - $mask[1]) - 1);
		return $this->inRange($start, $end);
	}

}
