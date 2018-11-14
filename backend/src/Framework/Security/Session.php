<?php

namespace Framework\Security;

/**
 * Class Session
 *
 * @package Framework\Security
 */
class Session {

	/**
	 * @var array
	 */
	protected $data = [];

	/**
	 * Session constructor
	 */
	public function __construct() {
		session_start();
		$this->data = & $_SESSION;
	}

	/**
	 * Get session data
	 *
	 * @param string $key
	 * @return mixed
	 */
	public function get(string $key) {
		return $this->data[$key];
	}

	/**
	 * Set session data
	 *
	 * @param string $key
	 * @param $value
	 */
	public function set(string $key, $value): void {
		$this->data[$key] = $value;
	}

	/**
	 * Magic getter
	 *
	 * @param string $key
	 * @return mixed
	 */
	public function __get(string $key) {
		return $this->get($key);
	}

	/**
	 * Magic setter
	 *
	 * @param string $key
	 * @param $value
	 */
	public function __set(string $key, $value): void {
		$this->set($key, $value);
	}

	/**
	 * Get session data
	 *
	 * @return array
	 */
	public function getData(): array {
		return $this->data;
	}

	/**
	 * Set session data
	 *
	 * @param array $data
	 */
	public function setData(array $data): void {
		$this->data = $data;
	}

	/**
	 * Destroy session
	 */
	public function destroy(): void {
		$this->data = [];
		session_destroy();
	}

}
