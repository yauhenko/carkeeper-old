<?php

namespace Framework\DB;

use Framework\Patterns\DI;
use Framework\DB\Errors\{CommonError, ConstraintError};

/**
 * Class Collection
 *
 * @package Core\DB
 */
abstract class Collection {

	/** @var string */
	protected $_table;

	/** @var string */
	protected $_entity;

	/**
	 * Add new Entity to Collection
	 *
	 * @param Entity $entity
	 * @return bool
	 * @throws ConstraintError
	 * @throws CommonError
	 * @throws \Exception
	 */
	public function add(Entity $entity): bool {
		$this->checkEntity($entity);
		/** @var Client $db */
		$db = DI::getInstance()->db;
		$entity->id = $db->insert($this->_table, $entity->getData());
		return true;
	}

	/**
	 * Update Entity data in Collection
	 *
	 * @param Entity $entity
	 * @return bool
	 * @throws ConstraintError
	 * @throws CommonError
	 * @throws \Exception
	 */
	public function update(Entity $entity) {
		$this->checkEntity($entity);
		/** @var Client $db */
		$db = DI::getInstance()->db;
		return $db->update($this->_table, $entity->getData(), 'id', $entity->id);
	}

	/**
	 * Check Entity collection
	 *
	 * @param Entity $entity
	 * @param bool $silent
	 * @return bool
	 * @throws \Exception
	 */
	public function checkEntity(Entity $entity, bool $silent = false): bool {
		if (get_class($entity) == $this->_entity) return true;
		elseif ($silent) return false;
		else throw new \Exception('Wrong entity type');
	}

	/**
	 * Find Entities in Collection
	 *
	 * @param string|null $where
	 * @param array $data
	 * @return array
	 * @throws ConstraintError
	 * @throws CommonError
	 * @throws \Exception
	 */
	public function find(string $where = null, array $data = []): array {
		$result = [];
		/** @var Client $db */
		$db = DI::getInstance()->db;
		$sql = $db->prepare('SELECT * FROM {&table} WHERE ' . ($where ?: 'TRUE'), ['table' => $this->_table]);
		$items = $db->find($sql, $data);
		foreach ($items as $item) {
			/** @var Entity $entity */
			$entity = new $this->_entity;
			$entity->setData($item);
			$result[] = $entity;
		}
		return $result;
	}

	/**
	 * Find Entity in Collection
	 *
	 * @param string|null $where
	 * @param array $data
	 * @return Entity|null
	 * @throws ConstraintError
	 * @throws CommonError
	 * @throws \Exception
	 */
	public function findOne(string $where = null, array $data = []): ?Entity {
		/** @var Client $db */
		$db = DI::getInstance()->db;
		$sql = $db->prepare('SELECT * FROM {&table} WHERE ' . ($where ?: 'TRUE'), ['table' => $this->_table]);
		$data = $db->findOne($sql, $data);
		/** @var Entity $entity */
		$entity = new $this->_entity;
		$entity->setData($data);
		return $entity;
	}

	/**
	 * Find Entity in Collection
	 *
	 * @param string $field
	 * @param $value
	 * @return Entity|null
	 * @throws ConstraintError
	 * @throws CommonError
	 * @throws \Exception
	 */
	public function findOneBy(string $field, $value): ?Entity {
		/** @var Client $db */
		$db = DI::getInstance()->db;
		$data = $db->findOneBy($this->_table, $field, $value);
		/** @var Entity $entity */
		$entity = new $this->_entity;
		$entity->setData($data);
		return $entity;
	}

}
