<?php

namespace Controllers;

use Framework\DB\Client;

class Directory extends BaseController {

	/**
	 * @route /directory/cars/marks
	 */
	public function getCarMarks(): array {
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT * FROM car_mark ORDER BY name');
	}

	/**
	 * @route /directory/cars/models
	 */
	public function getCarModels(): array {
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT * FROM car_model WHERE mark = {$mark} ORDER BY name', [
			'mark' => $this->params->mark
		]);
	}

	/**
	 * @route /directory/cars/generations
	 */
	public function getCarGenerations(): array {
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT * FROM car_generation WHERE model = {$model} ORDER BY year_begin', [
			'model' => $this->params->model
		]);
	}

	/**
	 * @route /directory/cars/series
	 */
	public function getCarSeries(): array {
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT * FROM car_serie WHERE generation = {$generation} ORDER BY name', [
			'generation' => $this->params->generation
		]);
	}

	/**
	 * @route /directory/cars/modifications
	 */
	public function getCarModifications(): array {
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT * FROM car_modification WHERE serie = {$serie} ORDER BY name', [
			'serie' => $this->params->serie
		]);
	}

}
