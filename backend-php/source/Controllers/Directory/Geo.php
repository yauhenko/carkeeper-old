<?php

namespace Controllers\Directory;

use Framework\DB\Client;
use Framework\Validation\Validator;
use Controllers\ApiController;

class Geo extends ApiController {

	/**
	 * @route /directory/geo/regions
	 */
	public function regions(): array {
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT id, name FROM geo_regions ORDER BY name');
	}

	/**
	 * @route /directory/geo/districts
	 */
	public function districts(): array {
		Validator::validateData($this->params, ['region' => ['required' => true, 'type' => 'int']]);
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT id, name FROM geo_districts WHERE region = {$region} ORDER BY name', [
			'region' => $this->params->region
		]);
	}

	/**
	 * @route /directory/geo/cities
	 */
	public function cities(): array {
		Validator::validateData($this->params, ['district' => ['required' => true, 'type' => 'int']]);
		/** @var Client $db */
		$db = $this->di->db;
		return $db->find('SELECT id, type, name FROM geo_cities WHERE district = {$district} 
			ORDER BY type = "г." DESC, type = "гп." DESC, type = "аг." DESC, name', [
			'district' => $this->params->district
		]);
	}

}
