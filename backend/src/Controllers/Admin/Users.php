<?php

namespace Controllers\Admin;

use Controllers\ApiController;
use Collections\Users as UsersCollection;
use Exception;
use Framework\DB\Pager;
use Framework\MQ\Task;
use Tasks\Push;

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
	 * @route /admin/users/get
	 */
	public function get(): array {
		$this->authAdmin();
		$user = UsersCollection::factory()->get($this->params->id);
		$data = $user->getData();
		unset($data['password'], $data['fcm']);
		return [
			'item' => $data
		];
	}

	/**
	 * @route /admin/users/update
	 */
	public function update(): array {
		$this->authAdmin();
		$user = UsersCollection::factory()->get($this->params->id);
		$user->setData((array)$this->params->item);
		return [
			'updated' => $user->save()
		];
	}

	/**
	 * @route /admin/users/delete
	 */
	public function delete(): array {
		$this->authAdmin();
		if(in_array($this->params->id, [1, 3])) throw new Exception('Нельзя удалять супер админов!');
		$user = UsersCollection::factory()->get($this->params->id);
		$user->delete();
		return [
			'deleted' => true
		];
	}

	/**
	 * @route /admin/users/push
	 */
	public function push(): array {
		$this->authAdmin();

		$task = Task::create([Push::class], [
			'fcm' => $this->params->fcm,
			'title' => $this->params->title,
			'body' => $this->params->body,
			'extra' => $this->params->extra
		])->start();

		return [
			'queued' => true,
			'task' => $task->id
		];
	}


}
