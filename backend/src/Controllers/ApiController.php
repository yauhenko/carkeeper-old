<?php

namespace Controllers;

use App\Sessions;
use App\Tools;
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

	/** @var bool */
	protected $admin = false;

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

		if($this->req->getMethod() === 'POST') {
			if($data = $this->req->getContent()) {
				if(!$this->params = json_decode($data)) {
					$this->params = Tools::toObject($this->req->request->all());
				}
			}
		} elseif($this->req->getMethod() === 'GET') {
			$this->params = Tools::toObject($this->req->query->all());
		} else {
			$this->params = Tools::toObject($_REQUEST);
		}

	}

	/**
	 * @throws \Exception
	 */
	protected function auth(): void {

		$token = $this->req->headers->get('Token') ?: $this->params->token;

		if(!$token)
			throw new \Exception('Token is not specified', 50);

		$this->user = Sessions::get($token, $this->req->getClientIp());

		if(!$this->user)
			throw new \Exception('Invalid token', 51);

		$this->admin = in_array($this->user->id, [1, 2, 3]);

	}

	protected function authAdmin(): void {
		$this->auth();
		if(!$this->admin) throw new \Exception('Insufficient Privileges', 403);
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

	protected function validate(array $rules, string $prefix = ''): void {
		Validator::validateData($this->params ?: [], $rules, false, $prefix);
	}

	protected function filter(array $filters, bool $strict = true): void {
		$this->params = Validator::filterData((array)$this->params, $filters, $strict, true);
	}

}
