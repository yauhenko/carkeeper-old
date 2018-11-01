<?php

namespace Framework\Utils;

class Time {

	public const MINUTE	= 60;
	public const HOUR	= 3600;
	public const DAY	= 86400;
	public const WEEK	= 604800;
	public const MONTH	= 2592000;
	public const YEAR	= 31536000;

	public static function date(int $timestamp = null, string $format = 'Y-m-d'): string {
		return date($format, $timestamp ?: time());
	}

	public static function dateTime(int $timestamp = null): string {
		return self::date($timestamp, 'Y-m-d H:i:s');
	}

	public static function dateTimeOffset(int $offset): string {
		$timestamp = time() + $offset;
		return self::dateTime($timestamp);
	}

	public static function dateOffset(int $offset): string {
		$timestamp = time() + $offset;
		return self::date($timestamp);
	}

}
