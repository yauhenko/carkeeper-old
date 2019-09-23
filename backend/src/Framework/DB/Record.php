<?php

namespace Framework\DB;

use Exception;
use Framework\Patterns\DI;

/**
 * Class Record
 * @package Core\DB
 */
abstract class Record {

    /** @var string */
    protected $_table = '';

    /** @var string */
    protected $_name = 'Record';

	/** @var array  */
	protected $_fields = [];

    /** @var Schema */
    protected $_schema;

    /** @var array */
    protected $_data = [];

    /** @var array */
    protected $_buffer = [];

    /**
     * Record constructor
     *
     * @param int|null $id
     * @throws Exception
     */
    public function __construct(int $id = null) {
        $this->_schema = new Schema($this->_fields);
        if($id) $this->getBy('id', $id);
    }

    /**
     * Assign data
     *
     * @param array|object $data
     */
    public function assign($data): void {
        $this->reset();
        $this->_data = (array)$data;
    }

    /**
     * Get record by field-value
     *
     * @param string $field
     * @param $value
     * @param bool $silent
     * @return Record|null
     * @throws Exception
     */
    public function getBy(string $field, $value, bool $silent = false): ?self {
        /** @var Client $db */
        $db = DI::getInstance()->db;
        $this->reset();
        if($obj = $db->findOneBy($this->_table, $field, $value)) {
            $this->_data = (array)$obj;
        } elseif($silent) {
            return null;
        } else {
            throw new Exception("{$this->_name} with {$field} {$value} doesn't exists");
        }
        return $this;
    }

    /**
     * Save to database
     *
     * @param bool $reload
     * @return bool
     * @throws Exception
     */
    public function save(bool $reload = false): bool {
        if(!$this->_buffer) return false;
        /** @var Client $db */
        $db = DI::getInstance()->db;
        if($this->id) {
            $res = $db->update($this->_table, $this->_buffer, 'id', $this->id);
        } else {
            $this->_data['id'] = $db->insert($this->_table, $this->_buffer);
            $res = true;
        }
        if($reload) $this->reload();
        $this->_buffer = [];
        return $res;
    }

    /**
     * Delete from database
     *
     * @return bool
     * @throws Exception
     */
    public function delete(): bool {
        if(!$this->id) return false;
        /** @var Client $db */
        $db = DI::getInstance()->db;
        return $db->delete($this->_table, 'id', $this->id);
    }

    /**
     * Reset object
     */
    public function reset(): void {
        $this->_data = $this->_buffer = [];
    }

    /**
     * Reload object
     *
     * @throws Exception
     */
    public function reload(): void {
        $this->getBy('id', $this->id);
    }

    /**
     * Get data from object
     *
     * @param string|null $criteria
     * @return array
     */
    public function getData(string $criteria = null): array {
        $fields = $this->_schema->getFields($criteria);
        $data = [];
        foreach ($fields as $field) {
            $data[$field] = $this->{$field};
        }
        return $data;
    }

    /**
     * Set data to object
     *
     * @param array $data
     */
    public function setData(array $data): void {
        foreach ($data as $field => $value) {
            $this->{$field} = $value;
        }
    }

    /**
     * Magic getter
     *
     * @param string $name
     * @return mixed
     */
    public function __get(string $name) {
        $value = $this->_data[$name];
//        if($value && $ref = $this->_fields[$name]['ref']) {
//            return new $ref($value);
//        }
        $value = $this->trigger('onGet', $name, $value);
        return $value;
    }

    /**
     * Magic setter
     *
     * @param string $field
     * @param $value
     * @throws Exception
     */
    public function __set(string $field, $value): void {
        $method = $this->id ? 'update' : 'create';
        if(!$this->_schema->checkField($field, $method))
            throw new Exception("Field '{$field}' is not allowed in {$method} method", 400);
        $value = $this->trigger('onSet', $field, $value);
        $this->_data[$field] = $this->_buffer[$field] = $value;
    }

    /**
     * Trigger
     *
     * @param string $name
     * @param string $field
     * @param $value
     * @return mixed
     */
    protected function trigger(string $name, string $field, $value) {
        $method = "{$name}{$field}";
        if(method_exists($this, $method)) return $this->{$method}($value);
        return $value;
    }

    /**
     * @return string
     */
    public function getTable(): string {
        return $this->_table;
    }

    /**
     * @return string
     */
    public function getName(): string {
        return $this->_name;
    }

//
//    public function getCollection() {
//        /** @var Client $db */
//        $db = DI::getInstance()->db;
//        $data = $db->find('SELECT * FROM {&table}', ['table' => $this->_table]);
//        $collection = [];
//        foreach ($data as $item) {
//            $class = get_called_class();
//            $a = new $class;
//            $a->assign((array)$item);
//            $collection[] = $a;
//        }
//        return $collection;
//    }
//
//
//
//    public function fetchCollection(array $collection): array {
//        $result = [];
//        foreach ($collection as $obj) {
//            $result[] =  $this->fetchRecord($obj);
//        }
//        return $result;
//    }
//
//    public function fetchRecord(Record $record) {
//
//        $item = $record->getData('public');
//
//        return $item;
//    }



}
