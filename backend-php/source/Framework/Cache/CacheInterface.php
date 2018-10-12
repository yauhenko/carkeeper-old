<?php

namespace Framework\Cache;

/**
 * Interface CacheInterface
 *
 * @package Core
 */
interface CacheInterface {

	/**
	 * Get value
	 *
	 * @param string $key
	 * @return mixed
	 */
	public function get(string $key);

	/**
	 * Set value
	 *
	 * @param string $key
	 * @param $value
	 * @param int $ttl
	 * @return mixed
	 */
	public function set(string $key, $value, int $ttl = 0): void;

	/**
	 * Delete value
	 *
	 * @param string $key
	 * @return mixed
	 */
	public function delete(string $key): void;

	/**
	 * Flush all cached data
	 */
	public function flush(): void;

}
