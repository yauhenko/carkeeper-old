<?php

namespace Controllers\Admin;

use Controllers\ApiController;
use Collections\Users as UsersCollection;
use Framework\DB\Pager;

class Users extends ApiController {

	/**
	 * @route /admin/users
	 */
	public function index(): array {
		$this->authAdmin();
		return Pager::create()
			->collection(UsersCollection::class)
			->page($this->params->page ?: 1)
			->limit($this->params->limit ?: 50)
			->exec()
			->getMetaData(Pager::OPTION_OBJECT_REFS);
	}

	/**
	 * @route /admin/users/delete
	 */
	public function delete(): array {
		$this->authAdmin();
		if(in_array($this->params->id, [1, 3])) throw new \Exception('Нельзя удалять супер админов!');
		$user = UsersCollection::factory()->get($this->params->id);
		$user->delete();
		return [
			'deleted' => true
		];
	}

}
