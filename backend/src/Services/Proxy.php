<?php

namespace Services;

class Proxy {

	protected static $list = [];

	public static function load(string $file): void {
		$data = trim(file_get_contents($file));
		self::$list = explode("\n", $data);
	}

	public static function getRandom(): string {
		$key = array_rand(self::$list);
		return self::$list[$key];
	}

	public static function getRandomURL(): string {
		$proxy = self::getRandom();
		return "http://rp1090346:eLFE5UsEdP@{$proxy}";
	}

}
