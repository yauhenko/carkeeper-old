<?php

namespace Controllers\Directory;

use Framework\DB\Client;
use Framework\Validation\Validator;
use Controllers\ApiController;

class Cars extends ApiController {

	/**
	 * @route /directory/cars/marks
	 */
	public function marks(): array {
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT id, name FROM car_mark ORDER BY name');
	}

	/**
	 * @route /directory/cars/models
	 */
	public function models(): array {
		Validator::validateData($this->params, ['mark' => ['required' => true, 'type' => 'int']]);
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT id, name FROM car_model WHERE mark = {$mark} ORDER BY name', [
			'mark' => $this->params->mark
		]);
	}

	/**
	 * @route /directory/cars/generations
	 */
	public function generations(): array {
		Validator::validateData($this->params, ['model' => ['required' => true, 'type' => 'int']]);
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT id, name, year_begin, year_end FROM car_generation WHERE model = {$model} ORDER BY year_begin, name', [
			'model' => $this->params->model
		]);
	}

	/**
	 * @route /directory/cars/series
	 */
	public function series(): array {
		Validator::validateData($this->params, ['generation' => ['required' => true, 'type' => 'int']]);
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT id, name FROM car_serie WHERE generation = {$generation} ORDER BY name', [
			'generation' => $this->params->generation
		]);
	}

	/**
	 * @route /directory/cars/modifications
	 */
	public function modifications(): array {
		Validator::validateData($this->params, ['serie' => ['required' => true, 'type' => 'int']]);
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT id, name, year_begin, year_end FROM car_modification WHERE serie = {$serie} ORDER BY year_begin, name', [
			'serie' => $this->params->serie
		]);
	}

}
