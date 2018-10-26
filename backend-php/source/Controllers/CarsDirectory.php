<?php

namespace Controllers;

use Framework\DB\Client;

class CarsDirectory extends ApiController {

	/**
	 * @route /directory/cars/marks
	 */
	public function marks(): array {
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT * FROM car_mark ORDER BY name');
	}

	/**
	 * @route /directory/cars/models
	 */
	public function models(): array {
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT * FROM car_model WHERE mark = {$mark} ORDER BY name', [
			'mark' => $this->params->mark
		]);
	}

	/**
	 * @route /directory/cars/generations
	 */
	public function generations(): array {
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT * FROM car_generation WHERE model = {$model} ORDER BY year_begin', [
			'model' => $this->params->model
		]);
	}

	/**
	 * @route /directory/cars/series
	 */
	public function series(): array {
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT * FROM car_serie WHERE generation = {$generation} ORDER BY name', [
			'generation' => $this->params->generation
		]);
	}

	/**
	 * @route /directory/cars/modifications
	 */
	public function modifications(): array {
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT * FROM car_modification WHERE serie = {$serie} ORDER BY name', [
			'serie' => $this->params->serie
		]);
	}

}
