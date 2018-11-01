<?php

namespace Controllers;

use App\Sessions;
use Entities\User;
use Framework\DB\Client;
use Framework\DB\Entity;
use Framework\MVC\AbstractController;
use Framework\Validation\Validator;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class ApiController
 *
 * @package Controllers
 */
abstract class ApiController extends AbstractController {

	/** @var Request req */
	protected $req;

	/**
	 * Parsed JSON Request
	 * @var mixed
	 */
	protected $params;

	/** @var User */
	protected $user;

	/**
	 * ApiController constructor
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

		if($this->params->token)
			$this->auth();

	}

	/**
	 * @throws \Exception
	 */
	protected function auth(): void {

		if(!$this->params->token)
			throw new \Exception('Token is not specified', 401);

		$this->user = Sessions::get($this->params->token, $this->req->getClientIp());

		if(!$this->user)
			throw new \Exception('Invalid token', 403);

	}

	protected function checkAccess(string $table, int $id, string $key = 'id'): void {
		/** @var Client $db */
		$db = $this->di->db;
		if(!$entry = $db->findOneBy($table, $key, $id, ['user']))
			throw new \Exception("Объект {$table} не существует ({$key}: {$id})", 400);
		if($entry['user'] !== $this->user->id)
			throw new \Exception('В доступе отказано', 403);
	}

	protected function checkDataAccess(array $data = null): void {
		if(!$data)
			throw new \Exception('Объект не существует', 404);
		if($data['user'] !== $this->user->id)
			throw new \Exception('В доступе отказано', 403);
	}

	protected function checkEntityAccess(Entity $entity = null): void {
		if(!$entity)
			throw new \Exception('Объект не существует', 404);
		if($entity->user !== $this->user->id)
			throw new \Exception('В доступе отказано', 403);
	}

	protected function validate(array $rules, string $prefix = null): void {
		Validator::validateData($this->params, $rules, false, $prefix);
	}

}
