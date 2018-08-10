<?php

error_reporting(E_ALL ^ E_NOTICE);

$data = file('/home/ya/CITY.csv');

echo 'SET FOREIGN_KEY_CHECKS=0;' . PHP_EOL;
echo 'TRUNCATE TABLE geo_regions;' . PHP_EOL;
echo 'TRUNCATE TABLE geo_districts;' . PHP_EOL;
echo 'TRUNCATE TABLE geo_cities;' . PHP_EOL;
echo 'SET autocommit = 0;' . PHP_EOL;
echo 'START TRANSACTION;' . PHP_EOL;

$obls = [];
$rns = [];
$cities = [];

$id = 0;
foreach ($data as $idx => $line) {
	if(!$idx) continue;
	list($_id, $_name, $_obl, $_rn, $_ss, $_type) = explode("\t", $line);
	if($_obl && !$obls[$_obl]) {
		$o = [
			'id' => ++$id,
			'name' => $_obl
		];
		$obls[$_obl] = $o;
		echo 'INSERT INTO geo_regions (id, name) VALUES (' . $o['id'] . ', "' . $o['name'] . '");' . PHP_EOL;

	}
}

$id = 0;
foreach ($data as $idx => $line) {
	if(!$idx) continue;
	list($_id, $_name, $_obl, $_rn, $_ss, $_type) = explode("\t", $line);
	if($_rn && preg_match('/ий$/', $_rn) && !$rns[$_rn]) {
		$o = [
			'id' => ++$id,
			'name' => $_rn,
			'region' => $obls[$_obl]['id']
		];
		$rns[$_rn] = $o;
		echo 'INSERT INTO geo_districts (id, region, name) VALUES (' . $o['id'] . ', ' . $o['region'] . ', "' . $o['name'] . '");' . PHP_EOL;
	}
}



$id = 0;
foreach ($data as $idx => $line) {
	if(!$idx) continue;
	list($_id, $_name, $_obl, $_rn, $_ss, $_type) = explode("\t", $line);
	if($_name && !$cities[$_obl][$_rn][$_name]) {
		$o =  [
			'id' => ++$id,
			'name' => $_name,
			'region' => $obls[$_obl]['id'],
			'district' => $rns[$_rn]['id'],
			'type' => $_type
		];;

		if(!$o['district']) {
			list($n_id, $n_name, $n_obl, $n_rn, $n_ss, $n_type) = explode("\t", $data[$idx+3]);
			$o['district'] =  $rns[$n_rn]['id'];
		}

		$cities[$_obl][$_rn][$_name] =$o;
		echo 'INSERT INTO geo_cities (id, region, district, type, name) VALUES (' . $o['id'] . ', ' . ($o['region'] ?: 'NULL') . ', ' . ($o['district'] ?: 'NULL') . ', "' . $o['type'] . '", "' . $o['name'] . '");' . PHP_EOL;
	}
}

echo 'COMMIT;';
echo 'SET FOREIGN_KEY_CHECKS=1;' . PHP_EOL;
