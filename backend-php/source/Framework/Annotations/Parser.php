<?php

namespace Framework\Annotations;

use Framework\Patterns\DI;
use Framework\Cache\CacheInterface;
use ReflectionClass, ReflectionMethod, ReflectionProperty;

/**
 * Class Annotations
 *
 * @package Core
 */
class Parser {

	/**
	 * Directories to scan
	 *
	 * @var array
	 */
	protected $dirs = [];

	/**
	 * Cache
	 * @var array
	 */
	protected $cache = [];

	/**
	 * Annotations constructor
	 *
	 * @param array $dirs
	 * @throws \Exception
	 */
	public function __construct(array $dirs) {
		$this->dirs = $dirs;
		/** @var CacheInterface $ci */
		$ci = DI::getInstance()->get('cache:file');
		if(!$this->cache = $ci->get('annotations')) {
			$this->cache = $this->parse();
			$ci->set('annotations', $this->cache, 3600);
		}
	}

	/**
	 * Get properties of class or object
	 *
	 * @param $object string|object
	 * @return array
	 */
	public function getProperties($object): array {
		$class = is_string($object) ? $object : get_class($object);
		return $this->cache[$class]['properties'] ?: [];
	}

	/**
	 * Get methods of class or object
	 *
	 * @param $object string|object
	 * @return array
	 */
	public function getMethods($object): array {
		$class = is_string($object) ? $object : get_class($object);
		return $this->cache[$class]['methods'] ?: [];
	}

	/**
	 * Get all parsed data
	 *
	 * @return array
	 */
	public function getAll(): array {
		return $this->cache;
	}

	/**
	 * Parse files in dirs
	 *
	 * @return array
	 * @throws \ReflectionException
	 */
	protected function parse(): array {
		$result = [];
		foreach ($this->dirs as $dir) {
			chdir($dir);
			foreach (glob('*.php') as $file) {
				$data = file_get_contents($file);
				preg_match('/namespace[\t\s]+([A-z\_]+).+;/s', $data, $ns);
				preg_match('/class[\t\s]+([A-z\_]+).*\{/s', $data, $nm);
				$class = ($ns[1] ? $ns[1] . '\\' : '') . $nm[1];

				$ref = new ReflectionClass($class);
				$props = $ref->getProperties(ReflectionProperty::IS_PUBLIC);
				foreach ($props as $p) {
					if($doc = $p->getDocComment()) {
						$result[$class]['properties'][$p->getName()] = $this->parseBlock($doc);
					}
				}

				$props = $ref->getMethods(ReflectionMethod::IS_PUBLIC);
				foreach ($props as $p) {
					if($doc = $p->getDocComment()) {
						$result[$class]['methods'][$p->getName()] = $this->parseBlock($doc);
					}
				}

			}

		}
		return $result;
	}

	/**
	 * Parse docblock
	 *
	 * @param string $block
	 * @return array
	 */
	protected function parseBlock(string $block): array {
		$result = [];
		$lines = explode("\n", $block) ?: [];
		foreach ($lines as $idx => $line) {
			$line = trim($line);
			$line = str_replace(['/**', '*/'], '', $line);
			$line = ltrim($line, "\t* ");
			if(!$line) continue;
			if(preg_match('/^\@([A-z0-9\_-]+)(\s(.+))?$/', $line, $m)) {
				$name = strtolower($m[1]);
				$value = $m[3];
				$method = "{$name}Parser";
				if(method_exists($this, $method)) {
					$result[$name] = $this->$method($value);
				} else {
					$result[$name] = $value ?: true;
				}
			}
		}
		return $result;
	}

	/**
	 * @param string $data
	 * @return array
	 */
	protected function routeParser(string $data) {
		[$path, $name] = explode(' ', $data, 2);
		return [
			'path' => $path,
			'name' => $name ?: 'route_' . md5($data)
		];
	}

	/**
	 * @param string $data
	 * @return array
	 */
	protected function varParser(string $data) {
		$vars = explode('|', $data);
		return [
			'type' => $vars[0],
			'nullable' => in_array('null', $vars),
			'raw' => $vars
		];
	}

	/**
	 * @param string $data
	 * @return mixed
	 */
	protected function validateParser(string $data) {
		return $this->parsePairs($data);
	}

	protected function authParser(string $data = null) {
		$props = ['auth' => true] + $this->parsePairs((string)$data);
		$props['role'] = $props['role'] ? explode(',', $props['role']) : null;
		return $props;
	}

	protected function parsePairs(string $data) {
		$props = [];
		foreach (explode(';', $data) as $arg) {
			[$key, $val] = explode(':', $arg, 2);
			$key = trim($key);
			$val = trim($val);
			if(!$key) continue;
			if($val === 'true') $val = true;
			elseif($val === 'false') $val = false;
			elseif($val === 'null') $val = null;
			elseif(is_numeric($val)) $val = (float)$val;
			elseif($val === null) $val = true;
			elseif($val{0} === '[') {
				$val = str_replace(['[', ']'], '', $val);
				$val = explode(',', $val);
				foreach ($val as &$v) {
					$v = trim($v);
				}
			} elseif ($val === '') $val = true;
			$props[$key] = $val;
		}
		return $props;
	}

}
