<?php

namespace Framework\Cache;

/**
 * Redis Cache
 *
 * @package Core\Cache
 */
class Redis implements CacheInterface {

	/**
	 * @var \Redis
	 */
	protected $redis;

	/**
	 * Redis Cache constructor
	 *
	 * @param string $host
	 * @param int $port
	 */
	public function __construct(string $host = 'localhost', int $port = 6379) {
		$this->redis = new \Redis;
		$this->redis->connect($host, $port);
	}

	/**
	 * Get cached value
	 *
	 * @param string $key
	 * @return mixed
	 */
	public function get(string $key) {
		$res = $this->redis->get($key) ?: null;
		return unserialize($res);
	}

	/**
	 * Cache value
	 *
	 * @param string $key
	 * @param $value
	 * @param int $ttl
	 */
	public function set(string $key, $value, int $ttl = 0): void {
		$value = serialize($value);
		$this->redis->set($key, $value, $ttl);
	}

	/**
	 * Delete cached value
	 *
	 * @param string $key
	 */
	public function delete(string $key): void {
		if(strpos($key, '*') !== false) {
			foreach($this->keys($key) as $k)
				$this->delete($k);
			return;
		}
		$this->redis->delete($key);
	}

	/**
	 * Search for keys by mask
	 *
	 * @param string $mask
	 * @return array
	 */
	public function keys(string $mask = '*'): array {
		return $this->redis->keys($mask);
	}

	/**
	 * Flush all cached data
	 */
	public function flush(): void {
		$this->redis->flushAll();
	}

}
