<?php

namespace App;

use Entities\Car;
use Entities\Journal\Record;
use Entities\User;
use Framework\DB\Client;
use Framework\Patterns\DI;

class References {

	protected $rules = [];

	public function __construct() {

		$this->rules[Car::class] = [
			'mark' => ['table' => 'car_mark', 'fields' => ['id', 'name']],
			'model' => ['table' => 'car_model', 'fields' => ['id', 'name']],
			'generation' => ['table' => 'car_generation', 'fields' => ['id', 'name', 'year_begin', 'year_end']],
			'serie' => ['table' => 'car_serie', 'fields' => ['id', 'name']],
			'modification' => ['table' => 'car_modification', 'fields' => ['id', 'name', 'year_begin', 'year_end']],
			'image' => ['table' => 'uploads']
		];

		$this->rules[Record::class] = [
			'type' => ['table' => 'journal_types', 'fields' => ['id', 'name']],
			'image' => ['table' => 'uploads']
		];

		$this->rules[User::class] = [
			'avatar' => ['table' => 'uploads'],
			'city' => ['table' => 'geo_cities', 'fields' => ['id', 'name', 'type']],
		];

	}

	public function get(array $list, array $rules = null): array {

		if(!$list) return [];
		if(!$rules) $rules = $this->rules[get_class($list[0])] ?: [];

		foreach ($rules as $key => $rule) {
			if(!$rule['key']) $rule['key'] = 'id';
			if(!$rule['fields']) $rule['fields'] = ['*'];
			$rules[$key] = $rule;
		}

		$refs = $result = [];

		foreach ($rules as $key => $rule) {
			foreach ($list as $item) {
				if($value = ((array)$item)[$key]) {
					$refs[$key][] = $value;
				}
			}
			$refs[$key] = array_unique($refs[$key] ?: []);
		}

		/** @var Client $db */
		$db = DI::getInstance()->db;

		foreach ($refs as $key => $ids) {
			if(!$ids) continue;
			$rule = $rules[$key];
			$buff = $db->query('SELECT {&fields} FROM {&table} WHERE {&key} IN {$ids}', [
				'fields' => $rule['fields'],
				'table' => $rule['table'],
				'key' => $rule['key'],
				'ids' => $ids
			]);

			foreach ($buff as $item) {
				$result[$key][$item['id']] = $rule['single'] ? $item[$rule['single']] : $item;
			}

		}

		return $result;
	}


	public function single(object $item, array $rules = null): array {

		if(!$rules) $rules = $this->rules[get_class($item)] ?: [];

		foreach ($rules as $key => $rule) {
			if(!$rule['key']) $rule['key'] = 'id';
			if(!$rule['fields']) $rule['fields'] = ['*'];
			$rules[$key] = $rule;
		}

		$refs = $result = [];

		foreach ($rules as $key => $rule) {
			if($value = ((array)$item)[$key]) {
				$refs[$key] = $value;
			}
		}

		/** @var Client $db */
		$db = DI::getInstance()->db;

		foreach ($refs as $key => $id) {
			if(!$id) continue;
			$rule = $rules[$key];
			$buff = $db->query('SELECT {&fields} FROM {&table} WHERE {&key} = {$id}', [
				'fields' => $rule['fields'],
				'table' => $rule['table'],
				'key' => $rule['key'],
				'id' => $id
			]);

			foreach ($buff as $item) {
				$result[$key] = $rule['single'] ? $item[$rule['single']] : $item;
			}
		}

		return $result;
	}

}
