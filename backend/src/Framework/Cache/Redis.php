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
	 * @var string|null
	 */
	protected $prefix = null;

	/**
	 * Redis Cache constructor
	 *
	 * @param string $host
	 * @param int $port
	 * @param string|null $prefix
	 */
	public function __construct(string $host = 'localhost', int $port = 6379, string $prefix = null) {
		$this->redis = new \Redis;
		$this->redis->connect($host, $port);
		$this->prefix = $prefix;
	}

	/**
	 * Get cached value
	 *
	 * @param string $key
	 * @return mixed
	 */
	public function get(string $key) {
		$key = $this->prefix ? "{$this->prefix}:{$key}" : $key;
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
		$key = $this->prefix ? "{$this->prefix}:{$key}" : $key;
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
		$key = $this->prefix ? "{$this->prefix}:{$key}" : $key;
		$this->redis->delete($key);
	}

	/**
	 * Search for keys by mask
	 *
	 * @param string $mask
	 * @return array
	 */
	public function keys(string $mask = '*'): array {
		$mask = $this->prefix ? "{$this->prefix}:{$mask}" : $mask;
		return $this->redis->keys($mask);
	}

	/**
	 * Flush all cached data
	 */
	public function flush(): void {
		$this->redis->flushAll();
	}

}
