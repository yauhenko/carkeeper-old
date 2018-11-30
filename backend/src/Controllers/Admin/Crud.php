<?php

namespace Controllers\Admin;

use App\References;
use Controllers\ApiController;
use Framework\DB\Client;
use Framework\DB\Pager;

class Crud extends ApiController {

	/** @var Client */
	protected $db;

	public function __construct() {
		parent::__construct();
		$this->db = $this->di->db;
	}

	/**
	 * @route /admin/crud/{table}/list
	 */
	public function index(): array {
		$this->authAdmin();
		return Pager::create()
			->sql('SELECT ** FROM {&table}')
			->bind(['table' => $this->di->params['table']])
			->rules($this->params->rules ? json_decode(json_encode($this->params->rules), true) : [])
			->order('ORDER BY id')
			->page($this->params->page ?: 1)
			->limit($this->params->limit ?: 50)
			->exec()
			->getMetaData();
	}

	/**
	 * @route /admin/crud/{table}/get
	 */
	public function get(): array {
		$this->authAdmin();
		$item = $this->db->findOneBy($this->di->params['table'], 'id', $this->params->id);
		if(!$item) throw new \Exception('Item not found', 404);
		/** @var References $refs */
		$refs = $this->di->refs;
		return [
			'item' => $item,
			'refs' => $refs->single((object)$item, (array)$this->params->rules ?: null)
		];
	}

	/**
	 * @route /admin/crud/{table}/create
	 */
	public function create(): array {
		$this->authAdmin();
		$id = $this->db->insert($this->di->params['table'], (array)$this->params->item);
		return [
			'created' => true,
			'id' => $id,
		];
	}

	/**
	 * @route /admin/crud/{table}/update
	 */
	public function update(): array {
		$this->authAdmin();
		$res = $this->db->update($this->di->params['table'], (array)$this->params->item, 'id', $this->params->id);
		return [
			'updated' => $res
		];
	}

	/**
	 * @route /admin/crud/{table}/delete
	 */
	public function delete(): array {
		$this->authAdmin();
		$res = $this->db->delete($this->di->params['table'], 'id', $this->params->id);
		return [
			'deleted' => $res
		];
	}

}
