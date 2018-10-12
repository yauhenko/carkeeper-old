<?php

namespace Controllers;

use Framework\DB\Client;
use Symfony\Component\HttpFoundation\Response;

class Directory extends BaseController {

	/**
	 * @route /directory/cars/marks
	 */
	public function getCarMarks(): Response {
		/** @var Client $db */
		$db = $this->di->db;
		$list = $db->find('SELECT id, name FROM car_mark ORDER BY name');
		return $this->jsonResult($list);
	}

}
