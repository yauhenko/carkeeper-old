<?php

namespace Framework\DB;

class PagedData {

	protected $meta = [];
	protected $data = [];

	public function __construct(array $meta, array $data) {
		$this->meta = $meta;
		$this->data = $data;
	}

	/**
	 * @return array
	 */
	public function getMeta(): array {
		return $this->meta;
	}

	/**
	 * @return array
	 */
	public function getData(): array {
		return $this->data;
	}

	public function getRaw(): array {
		return [
			'meta' => $this->meta,
			'data' => $this->data
		];
	}

}
