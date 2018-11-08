<?php

namespace Framework\DB;

use Framework\Patterns\DI;

class Pager {

	/** @var string */
	protected $sql = '';

	/** @var Client */
	protected $db;

	/** @var int */
	protected $page;

	/** @var int */
	protected $limit;

	/** @var string */
	protected $orderSql = '';

	/** @var array */
	protected $fields = ['*'];

	/** @var array */
	protected $binds = [];

	public function __construct(int $page = 1, int $limit = 50) {
		$this->page = $page;
		$this->limit = $limit;
		$this->db = DI::getInstance()->db;
	}

	public static function create(int $page = 1, int $limit = 50): self {
		return new self($page, $limit);
	}

	public function sql(string $sql): self {
		$this->sql = $sql;
		return $this;
	}

	public function fields(array $fields): self {
		$this->fields = $fields;
		return $this;
	}

	public function order(string $sql): self {
		$this->orderSql = $sql;
		return $this;
	}

	public function bind(array $data) {
		//$this->binds
		$this->sql = $this->db->prepare($this->sql, $data);
		return $this;
	}

	public function exec(): PagedData {
		$meta = [
			'page' => $this->page,
			'limit' => $this->limit,
		];

		$sql = str_replace('**', 'COUNT(*) AS cnt', $this->sql);

		$r = $this->db->query($sql);
		print_r($r);

		echo $sql;

		$data = [];
		return new PagedData($meta, $data);
	}


}
