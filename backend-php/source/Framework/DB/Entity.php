<?php

namespace Framework\DB;

use Framework\DB\Errors\CommonError;
use Framework\DB\Errors\ConstraintError;

/**
 * Class Entity
 *
 * @package Core\DB
 */
abstract class Entity {

	/** @var string */
	protected $_collection = '';

	/** @var int|null */
	public $id = null;

	/**
	 * Save Entity to Collection
	 *
	 * @return bool
	 * @throws ConstraintError
	 * @throws CommonError
	 * @throws \Exception
	 */
	public function save(): bool {
		$collection = $this->getCollection();
		if($this->id) return $collection->update($this);
		else return $collection->add($this);
	}

	/**
	 * Get Entity's data
	 *
	 * @return array
	 */
	public function getData(): array {
		$data = [];
		foreach(get_object_vars($this) as $k => $v) {
			if ($k{0} === '_') continue;
			$data[$k] = $this->{$k};
		}
		return $data;
	}

	/**
	 * Set data to Entity
	 *
	 * @param array $data
	 */
	public function setData(array $data): void {
		foreach ($data as $k => $v)
			$this->{$k} = $v;
	}

	/**
	 * Get Collection
	 *
	 * @return Collection
	 */
	public function getCollection(): Collection {
		return new $this->_collection;
	}

	/**
	 * Get fields list
	 *
	 * @return array
	 */
	public function getFields(): array {
		$fields = [];
		foreach(array_keys(get_object_vars($this)) as $key) {
			if ($key{0} === '_') continue;
			$fields[] = $key;
		}
		return $fields;
	}

	/**
	 * Magic getter
	 *
	 * @param string $name
	 * @throws \Exception
	 */
	public function __get(string $name) {
		throw new \Exception('Unknown property: ' . $name);
	}

	/**
	 * Magic setter
	 *
	 * @param string $name
	 * @param $value
	 * @throws \Exception
	 */
	public function __set(string $name, $value) {
		throw new \Exception('Unknown property: ' . $name);
	}

	/**
	 * Assign data from entity
	 *
	 * @param Entity $entity
	 */
	public function assign(Entity $entity) {
		$this->setData($entity->getData());
	}

}
