<?php

namespace Controllers\Garage;

use Framework\DB\Client;
use Controllers\ApiController;

class Insurance extends ApiController {

	/**
	 * @route /garage/insurance
	 */
	public function index() {

		$this->auth();

		$this->validate([
			'car' => ['required' => true, 'type' => 'int']
		]);

		$this->checkAccess('cars', $this->params->car);

		/** @var Client $db */
		$db = $this->di->db;

		$list =  $db->query('SELECT type, notify, edate FROM cars_insurance WHERE car = {$car}', ['car' => $this->params->car]);
		if(!$list) {
			foreach (['regular', 'casco'] as $type) {
				$item = [
					'type' => $type,
					'notify' => false,
					'edate' => null,
					'car' => $this->params->car
				];
				$db->insert('cars_insurance', $item);
				unset($item['car']);
				$list[] = $item;
			}
		}

		$result = [];
		foreach ($list as $item) {
			$type = $item['type'];
			unset($item['car'], $item['type']);
			$item['notify'] = (bool)$item['notify'];
			$result[$type] = $item;
		}

		return [
			'insurance' => $result
		];
	}

	/**
	 * @route /garage/insurance/update
	 */
	public function update() {

		$this->auth();

		$this->validate([
			'car' => ['required' => true, 'type' => 'int'],
			'insurance' => [
				'required' => true,
				'type' => 'struct',
				'sub' => [
					'type' => ['required' => true, 'in' => ['regular', 'casco']],
					'notify' => ['required' => true, 'type' => 'bool'],
					'edate' => ['date' => true],
				]
			]
		]);

		$this->checkAccess('cars', $this->params->car);

		/** @var Client $db */
		$db = $this->di->db;

		$where = $db->prepare('car = {$car} AND type = {$type}', [
			'car' => $this->params->car,
			'type' => $this->params->insurance->type
		]);

		$res = $db->updateWhere('cars_insurance', (array)$this->params->insurance, $where);

		return [
			'updated' => $res
		];

	}

}
