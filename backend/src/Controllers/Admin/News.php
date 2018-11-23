<?php

namespace Controllers\Admin;

use Controllers\ApiController;
use Framework\DB\Client;
use Framework\DB\Pager;

class News extends ApiController {

	/**
	 * @route /admin/news
	 */
	public function index(): array {
		$this->authAdmin();
		return Pager::create()
			->sql('SELECT ** FROM news')
			->page($this->params->page ?: 1)
			->limit($this->params->limit ?: 50)
			->exec()
			->getMetaData(Pager::OPTION_OBJECT_REFS);
	}


	/**
	 * @route /admin/news/get
	 */
	public function get(): array {
		$this->authAdmin();

		/** @var Client $db */
		$db = $this->di->db;

		$news = $db->findOneBy('news', 'id', $this->params->id);
		//$news['content'] = json_decode($news['content']);

		return [
			'item' => $news
		];
	}

	/**
	 * @route /admin/news/create
	 */
	public function create(): array {
		$this->authAdmin();

		/** @var Client $db */
		$db = $this->di->db;

		//$this->params->item->content = json_encode($this->params->item->content);
		$id = $db->insert('news', (array)$this->params->item);

		return [
			'created' => true,
			'id' => $id
		];

	}

	/**
	 * @route /admin/news/update
	 */
	public function update(): array {
		$this->authAdmin();

		/** @var Client $db */
		$db = $this->di->db;

		//$this->params->item->content = json_encode($this->params->item->content);
		$res = $db->update('news', (array)$this->params->item, 'id', $this->params->id);

		return [
			'updated' => $res
		];

	}

	/**
	 * @route /admin/news/delete
	 */
	public function delete(): array {
		$this->authAdmin();

		/** @var Client $db */
		$db = $this->di->db;

		return [
			'deleted' => $db->delete('news', 'id', $this->params->id)
		];

	}



	/**
	 * @route /admin/news/channels
	 */
	public function channelsIndex(): array {
		$this->authAdmin();
		/** @var Client $db */
		$db = $this->di->db;
		return [
			'channels' => $db->query('SELECT * FROM news_channels')
		];
	}

}
