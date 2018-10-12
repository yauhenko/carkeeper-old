<?php

namespace Framework\Types;

use Exception;

class URL {

	protected $scheme;
	protected $host;
	protected $port;
	protected $user;
	protected $pass;
	protected $path;
	protected $query;
	protected $fragment;
	protected $params;

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

	public function __toString(): string {
		return $this->asString();
	}

	public function extendParams(array $params): self {
		$this->params = array_merge($this->params, $params);
		$this->query = http_build_query($this->params);
		return $this;
	}

	public function getParams(): ?array {
		return $this->params;
	}

	public function setParams(array $params = []): self {
		$this->params = $params;
		$this->query = http_build_query($this->params);
		return $this;
	}

	public function getScheme(): ?string {
		return $this->scheme;
	}

	public function setScheme(string $scheme): self {
		$this->scheme = $scheme;
		return $this;
	}

	public function getHost(): ?string {
		return $this->host;
	}

	public function setHost(string $host): self {
		$this->host = $host;
		return $this;
	}

	public function getPort(): ?int {
		return $this->port;
	}

	public function setPort(int $port): self {
		$this->port = $port;
		return $this;
	}

	public function getUser(): ?string {
		return $this->user;
	}

	public function setUser(string $user): self {
		$this->user = $user;
		return $this;
	}
	public function getPass(): ?string {
		return $this->pass;
	}

	public function setPass(string $pass): self {
		$this->pass = $pass;
		return $this;
	}

	public function getPath(): ?string {
		return $this->path;
	}

	public function setPath(string $path): self {
		$this->path = $path;
		return $this;
	}

	public function getQuery(): ?string {
		return $this->query;
	}

	public function setQuery(string $query): self {
		$this->query = $query;
		return $this;
	}

	public function getFragment(): ?string {
		return $this->fragment;
	}

	public function setFragment(string $fragment): self {
		$this->fragment = $fragment;
		return $this;
	}

	public function go() {
		header('Location: ' . $this->asString());
		exit;
	}

}
