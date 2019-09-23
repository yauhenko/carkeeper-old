<?php

namespace Framework\DB;

use Exception;
use Framework\Patterns\DI;
use Framework\DB\Errors\{CommonError, ConstraintError};
use Framework\Validation\Validator;

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
	 * Insert new Entity to Collection
	 *
	 * @param Entity $entity
	 * @return bool
	 * @throws ConstraintError
	 * @throws CommonError
	 * @throws Exception
	 */
	public function insert(Entity $entity): bool {
		$this->checkEntity($entity);
		Validator::validateEntity($entity);
		/** @var Client $db */
		$db = DI::getInstance()->db;
		$id = $db->insert($this->_table, $entity->getData());
		if(is_numeric($id)) $entity->id = $id;
		return true;
	}

	/**
	 * Update Entity data in Collection
	 *
	 * @param Entity $entity
	 * @return bool
	 * @throws ConstraintError
	 * @throws CommonError
	 * @throws Exception
	 */
	public function update(Entity $entity) {
		$this->checkEntity($entity);
		Validator::validateEntity($entity);
		/** @var Client $db */
		$db = DI::getInstance()->db;
		return $db->update($this->_table, $entity->getData(), 'id', $entity->id);
	}

	/**
	 * Delete Entity from Collection
	 *
	 * @param Entity $entity
	 * @return bool
	 * @throws Exception
	 */
	public function delete(Entity $entity) {
		$this->checkEntity($entity);
		/** @var Client $db */
		$db = DI::getInstance()->db;
		return $db->delete($this->_table, 'id', $entity->id);
	}

	/**
	 * Check Entity collection
	 *
	 * @param Entity $entity
	 * @param bool $silent
	 * @return bool
	 * @throws Exception
	 */
	public function checkEntity(Entity $entity, bool $silent = false): bool {
		if (get_class($entity) == $this->_entity) return true;
		elseif ($silent) return false;
		else throw new Exception('Wrong entity type');
	}

	/**
	 * Find Entities in Collection
	 *
	 * @param string|null $query
	 * @param array $data
	 * @return array
	 * @throws ConstraintError
	 * @throws CommonError
	 * @throws Exception
	 */
	public function find(string $query = null, array $data = []): array {
		$result = [];
		/** @var Client $db */
		$db = DI::getInstance()->db;
		if(preg_match('/^SELECT/i', $query)) {
			$sql = $query;
		} else {
			$sql = $db->prepare('SELECT * FROM {&table} WHERE ' . ($query ?: 'TRUE'), ['table' => $this->_table]);
		}
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
	 * @param string|null $query
	 * @param array $data
	 * @param bool $silent
	 * @return Entity|null
	 * @throws Exception
	 */
	public function findOne(string $query = null, array $data = [], bool $silent = false): ?Entity {
		/** @var Client $db */
		$db = DI::getInstance()->db;
		if(preg_match('/^SELECT/i', $query)) {
			$sql = $query;
		} else {
			$sql = $db->prepare('SELECT * FROM {&table} WHERE ' . ($query ?: 'TRUE'), ['table' => $this->_table]);
		}
		if($data = $db->findOne($sql, $data)) {
			/** @var Entity $entity */
			$entity = new $this->_entity;
			$entity->setData($data);
			return $entity;
		} elseif ($silent) {
			return null;
		} else {
			throw new Exception('Entity does not exists', 404);
		}
	}

	/**
	 * Find Entity in Collection
	 *
	 * @param string $field
	 * @param $value
	 * @param bool $silent
	 * @return Entity|null
	 * @throws Exception
	 */
	public function findOneBy(string $field, $value, bool $silent = false): ?Entity {
		/** @var Client $db */
		$db = DI::getInstance()->db;
		if($data = $db->findOneBy($this->_table, $field, $value)) {
			/** @var Entity $entity */
			$entity = new $this->_entity;
			$entity->setData($data);
			return $entity;
		} elseif ($silent) {
			return null;
		} else {
			throw new Exception('Entity does not exists', 404);
		}
	}

	/**
	 * Get Entity by id
	 *
	 * @param int $id
	 * @param bool $silent
	 * @return Entity|null
	 * @throws Exception
	 */
	public function get(int $id, bool $silent = false): ?Entity {
		return $this->findOneBy('id', $id, $silent);
	}

	/**
	 * @param Entity $entity
	 * @return bool
	 * @throws Exception
	 */
	public function exists(Entity $entity): bool {
		/** @var Client $db */
		$db = DI::getInstance()->db;
		return (bool)$db->findOneBy($this->_table, 'id', $entity->id, ['id']);
	}

	/**
	 * Collection factory
	 *
	 * @return Collection
	 */
	public static function factory(): self {
		$class = get_called_class();
		return new $class;
	}

	/**
	 * @return string
	 */
	public function getEntityClass(): string {
		return $this->_entity;
	}

	public function getTable(): string {
		return $this->_table;
	}

}
