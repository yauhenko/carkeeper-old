<?php

namespace Framework\Types;

use Exception;

/**
 * Class URL
 * @package Framework\Types
 */
class URL {

	/**
	 * @var string
	 */
	protected $scheme;

	/**
	 * @var string
	 */
	protected $host;

	/**
	 * @var int|null
	 */
	protected $port;

	/**
	 * @var
	 */
	protected $user;

	/**
	 * @var
	 */
	protected $pass;

	/**
	 * @var string
	 */
	protected $path;

	/**
	 * @var
	 */
	protected $query;

	/**
	 * @var
	 */
	protected $fragment;

	/**
	 * @var
	 */
	protected $params;

	/**
	 * URL constructor
	 * @param string $url
	 * @throws Exception
	 */
	public function __construct(string $url) {
		$data = parse_url($url);
		if(!$data || count($data) < 2)
			throw new Exception('Invalid URL format: %s', $url);

		foreach ($data as $prop => $value) {
			$this->{$prop} = $value;
		}
		if(!$this->path) $this->path = '/';
		parse_str($this->query, $this->params);
	}

	/**
	 * Get URL as string
	 *
	 * @return string
	 */
	public function asString(): string {
		$url = $this->scheme . '://';
		if($this->user) {
			$url .= $this->user;
			if($this->pass) $url .= ':' . $this->pass;
			$url .= '@';
		}
		$url .= $this->host;
		if($this->port) $url .= ':' . $this->port;
		$url .= $this->path;
		if($this->query) $url .= '?' . $this->query;
		if($this->fragment) $url .= '#' . $this->fragment;
		return $url;
	}

	/**
	 * @return string
	 */
	public function __toString(): string {
		return $this->asString();
	}

	/**
	 * @param array $params
	 * @return URL
	 */
	public function extendParams(array $params): self {
		$this->params = array_merge($this->params, $params);
		$this->query = http_build_query($this->params);
		return $this;
	}

	/**
	 * @return array|null
	 */
	public function getParams(): ?array {
		return $this->params;
	}

	/**
	 * @param array $params
	 * @return URL
	 */
	public function setParams(array $params = []): self {
		$this->params = $params;
		$this->query = http_build_query($this->params);
		return $this;
	}

	/**
	 * @return null|string
	 */
	public function getScheme(): ?string {
		return $this->scheme;
	}

	/**
	 * @param string $scheme
	 * @return URL
	 */
	public function setScheme(string $scheme): self {
		$this->scheme = $scheme;
		return $this;
	}

	/**
	 * @return null|string
	 */
	public function getHost(): ?string {
		return $this->host;
	}

	/**
	 * @param string $host
	 * @return URL
	 */
	public function setHost(string $host): self {
		$this->host = $host;
		return $this;
	}

	/**
	 * @return int|null
	 */
	public function getPort(): ?int {
		return $this->port;
	}

	/**
	 * @param int $port
	 * @return URL
	 */
	public function setPort(int $port): self {
		$this->port = $port;
		return $this;
	}

	/**
	 * @return null|string
	 */
	public function getUser(): ?string {
		return $this->user;
	}

	/**
	 * @param string $user
	 * @return URL
	 */
	public function setUser(string $user): self {
		$this->user = $user;
		return $this;
	}

	/**
	 * @return null|string
	 */
	public function getPass(): ?string {
		return $this->pass;
	}

	/**
	 * @param string $pass
	 * @return URL
	 */
	public function setPass(string $pass): self {
		$this->pass = $pass;
		return $this;
	}

	/**
	 * @return null|string
	 */
	public function getPath(): ?string {
		return $this->path;
	}

	/**
	 * @param string $path
	 * @return URL
	 */
	public function setPath(string $path): self {
		$this->path = $path;
		return $this;
	}

	/**
	 * @return null|string
	 */
	public function getQuery(): ?string {
		return $this->query;
	}

	/**
	 * @param string $query
	 * @return URL
	 */
	public function setQuery(string $query): self {
		$this->query = $query;
		return $this;
	}

	/**
	 * @return null|string
	 */
	public function getFragment(): ?string {
		return $this->fragment;
	}

	/**
	 * @param string $fragment
	 * @return URL
	 */
	public function setFragment(string $fragment): self {
		$this->fragment = $fragment;
		return $this;
	}

	/**
	 *
	 */
	public function go() {
		header('Location: ' . $this->asString());
		exit;
	}

}
