<?php

namespace Framework\Cache;

/**
 * File Cache
 *
 * @package Core\Cache
 */
class File implements CacheInterface {

	/** @var string */
	protected $cacheDir;

	/** @var int */
	protected $factor;

	/** @var array  */
	protected $pathCache = [];

	/**
	 * File cache constructor
	 *
	 * @param string $cacheDir
	 * @param int $factor
	 */
	public function __construct(string $cacheDir, int $factor = 0) {
		$this->cacheDir = $cacheDir;
		$this->factor = $factor;
	}

	/**
	 * Get cached value
	 *
	 * @param string $key
	 * @return mixed|null
	 */
	public function get(string $key) {
		['path' => $path] = $this->getPath($key);
		if(!file_exists($path)) return null;
		$meta = unserialize(file_get_contents($path));
		if($meta['e'] && $meta['e'] < time()) {
			unlink($path);
			return null;
		} else {
			return $meta['d'];
		}
	}

	/**
	 * Cache value
	 *
	 * @param string $key
	 * @param $value
	 * @param int $ttl
	 */
	public function set(string $key, $value, int $ttl = 0): void {
		['dir' => $dir, 'path' => $path] = $this->getPath($key);
		if(!is_dir($dir)) mkdir($dir, 0755, true);
		file_put_contents($path, serialize([
			'e' => $ttl ? time() + $ttl : null,
			'd' => $value
		]));
	}

	/**
	 * Delete cached value
	 *
	 * @param string $key
	 */
	public function delete(string $key): void {
		['path' => $path] = $this->getPath($key);
		if(file_exists($path)) unlink($path);
	}

	/**
	 * Flush all cached data
	 */
	public function flush(): void {
		if($this->cacheDir && is_dir($this->cacheDir)) {
			system("find {$this->cacheDir} -name 'cache_*' -delete");
		}
	}

	/**
	 * @param string $key
	 * @return array
	 */
	protected function getPath(string $key): array {
		if($path = $this->pathCache[$key]) return $path;
		$hash = md5($key);
		$dir = $this->cacheDir;
		for($i = 0; $i < $this->factor; $i++) $dir .= '/cache_' . substr($hash, ($i * 2), 2);
		$file = 'cache_' . $hash;
		$path = ['dir' => $dir, 'file' => $file, 'path' => "{$dir}/{$file}"];
		return $this->pathCache[$key] = $path;
	}

}
