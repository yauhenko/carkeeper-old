<?php

namespace Framework\DB;

use Framework\Patterns\DI;

/**
 * Class Pager
 *
 * @package Framework\DB
 */
class Pager implements \Iterator {

	/**
	 * Count items using COUNT(*) statement
	 */
	public const METHOD_COUNT = 0;

	/**
	 * Count items using $result->num_rows of full SELECT TRUE query
	 */
	public const METHOD_RESULT = 1;

	/** @var string */
	protected $sql = '';

	/** @var Client */
	protected $db;

	/** @var int */
	protected $page;

	/** @var int|null */
	protected $pages = null;

	/** @var int|null */
	protected $count = null;

	/** @var array */
	protected $data = [];

	/** @var int */
	protected $limit;

	/** @var string */
	protected $orderSql = '';

	/** @var array */
	protected $fields = ['*'];

	/**
	 * Get current MetaData
	 *
	 * @return array
	 */
	public function current(): array {
		return $this->exec()->getMetaData();
	}

	/**
	 * Move forward to next page
	 */
	public function next(): void {
		$this->page++;
	}

	/**
	 * Return the key of the current page
	 *
	 * @return int|mixed
	 */
	public function key(): ?int {
		return $this->page;
	}

	/**
	 * Checks if current position is valid
	 *
	 * @return bool
	 */
	public function valid(): bool {
		if($this->page < 1) return false;
		if($this->page > $this->pages) return false;
		return true;
	}

	/**
	 * Rewind the Iterator to the first page
	 */
	public function rewind(): void {
		$this->page = 1;
		$this->data = [];
	}

	/**
	 * Pager constructor
	 *
	 * @param int $page
	 * @param int $limit
	 * @throws \Exception
	 */
	public function __construct(int $page = 1, int $limit = 50) {
		$this->setPage($page);
		$this->setLimit($limit);
		$this->db = DI::getInstance()->db;
	}

	/**
	 * Pager Factory
	 *
	 * @param int $page
	 * @param int $limit
	 * @return Pager
	 * @throws \Exception
	 */
	public static function create(int $page = 1, int $limit = 50): self {
		return new self($page, $limit);
	}

	/**
	 * Set SQL
	 *
	 * @param string $sql
	 */
	public function setQuery(string $sql): void {
		$this->sql = $sql;
	}

	/**
	 * Set fields list
	 *
	 * @param array $fields
	 */
	public function setFields(array $fields): void {
		$this->fields = $fields;
	}

	/**
	 * Set order sql
	 *
	 * @param string $sql
	 */
	public function setOrder(string $sql): void {
		$this->orderSql = $sql;
	}

	/**
	 * Set page
	 *
	 * @param int $page
	 */
	public function setPage(int $page): void {
		if($page < 1) $page = 1;
		if($this->pages !== null && $page > $this->pages) $page = $this->pages;
		$this->page = $page;
	}

	/**
	 * Set limit per page
	 *
	 * @param int $limit
	 */
	public function setLimit(int $limit): void {
		$this->limit = $limit;
	}

	/**
	 * Bind data to SQL
	 *
	 * @param array $data
	 */
	public function bind(array $data): void {
		$this->sql = $this->db->prepare($this->sql, $data);
	}

	/**
	 * Init pager
	 *
	 * @param int $method
	 * @return Pager
	 */
	public function init(int $method = self::METHOD_COUNT): self {

		if($method === self::METHOD_COUNT) {
			$sql = str_replace('**', 'COUNT(*) AS cnt', $this->sql);
			$this->count = (int)$this->db->findOne($sql)['cnt'];

		} elseif ($method === self::METHOD_RESULT) {
			$sql = str_replace('**', 'TRUE', $this->sql);
			$this->count = $this->db->query($sql, [], function ($res) {
				return $res->num_rows;
			});
		}

		$this->pages = ceil($this->count / $this->limit);
		return $this;
	}

	/**
	 * Executes page-data fetch
	 *
	 * @param bool $force
	 * @return Pager
	 */
	public function exec(bool $force = false): self {
		if($force || $this->count === null || $this->pages === null) $this->init();
		if($this->page > $this->pages) $this->page = $this->pages;
		if($this->page < 1) $this->page = 1;
		$sql = str_replace('**', $this->db->escapeId($this->fields), $this->sql) . ' ' . $this->orderSql;
		$sql .= ' LIMIT ' . $this->limit . ' OFFSET ' . (($this->page - 1) * $this->limit);
		$this->data = $this->db->query($sql);
		return $this;
	}

	/**
	 * Get meta
	 *
	 * @return array
	 */
	public function getMeta(): array {
		return [
			'page' => $this->page,
			'pages' => $this->pages,
			'limit' => $this->limit,
			'count' => $this->count
		];
	}

	/**
	 * Get data
	 *
	 * @return array
	 */
	public function getData(): array {
		return $this->data;
	}

	/**
	 * Get meta-data
	 *
	 * @return array
	 */
	public function getMetaData(): array {
		return [
			'meta' => $this->getMeta(),
			'data' => $this->getData()
		];
	}

	/**
	 * Get current page
	 *
	 * @return int
	 */
	public function getPage(): int {
		return $this->page;
	}

	/**
	 * Get total pages count
	 *
	 * @return int|null
	 */
	public function getPages(): ?int {
		return $this->pages;
	}

	/**
	 * Get total items count
	 *
	 * @return int|null
	 */
	public function getCount(): ?int {
		return $this->count;
	}

	/**
	 * Get limit per page
	 *
	 * @return int
	 */
	public function getLimit(): int {
		return $this->limit;
	}

	/**
	 * Set SQL (shortcut)
	 *
	 * @param string $sql
	 * @return Pager
	 */
	public function sql(string $sql): self {
		$this->setQuery($sql);
		return $this;
	}

	/**
	 * Set fields (shortcut)
	 *
	 * @param array $fields
	 * @return Pager
	 */
	public function fields(array $fields): self {
		$this->setFields($fields);
		return $this;
	}

	/**
	 * Set order sql (shortcut)
	 *
	 * @param string $sql
	 * @return Pager
	 */
	public function order(string $sql): self {
		$this->setOrder($sql);
		return $this;
	}

	/**
	 * Set page (shortcut)
	 *
	 * @param int $page
	 * @return Pager
	 */
	public function page(int $page): self {
		$this->setPage($page);
		return $this;
	}

	/**
	 * Set limit (shortcut)
	 * @param int $limit
	 * @return Pager
	 */
	public function limit(int $limit): self {
		$this->setLimit($limit);
		return $this;
	}

}
