<?php

namespace App;

use Framework\DB\Client;
use Framework\Patterns\DI;

class Stats {

	public static function roll(array $data, array $cnts): void {

		/** @var Client $db */
		$db = DI::getInstance()->db;

		Tools::filterArray($data, [
			'date', 'source'
		]);

		Tools::filterArray($cnts, ['clicks', 'uniqs', 'installs', 'launches', 'cars', 'fines', 'cards']);

		if(!$data['date'] || !$data['source']) return;

		$data += $cnts;

		$keys = array_keys($data);
		$vals = array_values($data);
		$pairs = [];

		foreach ($cnts as $k => $v) {
			$pairs[] = $db->escapeId($k) . ' = ' .  $db->escapeId($k) . ' + ' . $db->escape($v);
		}

		$sql = 'INSERT INTO stats (`' . implode('`, `', $keys) . '`) VALUES ' . $db->escape($vals) .
			' ON DUPLICATE KEY UPDATE ' . implode(', ', $pairs);
		$db->query($sql);

	}

}
