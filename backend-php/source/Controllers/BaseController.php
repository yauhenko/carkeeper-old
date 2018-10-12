<?php

namespace Controllers;

use Framework\DB\Client;
use Framework\MVC\AbstractController;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class BaseController
 *
 * @package Controllers
 */
abstract class BaseController extends AbstractController {

	/** @var Request req */
	protected $req;

	/**
	 * Parsed JSON Request
	 * @var mixed
	 */
	protected $params;

	protected $user;

	/**
	 * BaseController constructor
	 * @throws \Exception
	 */
	public function __construct() {

		parent::__construct();

		/** @var Request req */
		$this->req = $this->di->request;

		if($this->req->getMethod() !== 'POST')
			throw new \Exception('Only POST method accepted', 405);

		if(!$data = $this->req->getContent())
			throw new \Exception('Empty request', 400);

		if(!$this->params = json_decode($data))
			throw new \Exception('Invalid JSON-data', 400);

		if($this->params->token) $this->auth();

	}

	protected function auth(): void {

		/** @var Client $db */
		$db = $this->di->db;

		$this->user = $db->findOne('SELECT u.* FROM users u
			INNER JOIN sessions s ON s.user = u.id AND s.token = {$token}
			WHERE u.active = 1 AND s.edate > NOW()
		', ['token' => $this->params['token']]);

		if(!$this->user)
			throw new \Exception('Invalid token', 401);

	}

}
