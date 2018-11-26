<?php

namespace Controllers;

use Framework\DB\Client;
use Framework\DB\Pager;

class News extends ApiController {

	/**
	 * @route /news
	 */
	public function index(): array {
		$res = Pager::create()
			->sql('SELECT ** FROM news WHERE published = 1')
			->fields(['id', 'title', 'content', 'channel', 'date_begin', 'date_end', 'pinned'])
			->order('ORDER BY pinned = 1 DESC, id DESC')
			->page($this->params->page ?: 1)
			->limit($this->params->limit ?: 50)
			->rules(['channel' => ['table' => 'news_channels']])->exec()
			->getMetaData(Pager::OPTION_OBJECT_REFS);

		foreach ($res['data'] as &$item) {
			$item['content'] = json_decode($item['content']);
		}

		return $res;
	}

	/**
	 * @route /news/get
	 */
	public function get(): array {

		/** @var Client $db */
		$db = $this->di->db;

		$news = $db->findOneBy('news', 'id', $this->params->id);
		$news['content'] = json_decode($news['content']);

		return [
			'item' => $news
		];
	}

	/**
	 * @route /news/channels
	 */
	public function channels(): array {
		/** @var Client $db */
		$db = $this->di->db;
		return [
			'channels' => $db->query('SELECT * FROM news_channels')
		];
	}

}
