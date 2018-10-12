<?php

namespace Framework\Types;

use Exception;

class JSON {

	protected $data;

	public function __construct(string $json = null, $data = null) {
		if($json !== null) {
			$this->setData(self::decode($json));
		} elseif($data !== null) {
			$this->setData($data);
		} else {
			throw new Exception('Incorrect usage');
		}
	}

	public static function create($data): self {
		return new self(null, $data);
	}

	public function setData($data): void {
		$this->data = $data;
	}

	public function getData() {
		return $this->data;
	}

	public function asString(int $options = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE, int $depth = 512): string {
		return self::encode($this->data, $options, $depth);
	}

	public function __toString(): string {
		return $this->asString();
	}

	public static function encode($value, int $options = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE, int $depth = 512): string {
		return json_encode($value, $options, $depth);
	}

	public static function decode(string $json, bool $assoc = true, int $depth = 512, int $options = 0) {
		$data = json_decode($json, $assoc, $depth, $options);
		if($data === null && $error = json_last_error()) {
			throw new Exception('JSON: ' . json_last_error_msg());
		}
		return $data;
	}

}
