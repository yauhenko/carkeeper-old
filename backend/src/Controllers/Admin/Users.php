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

}
