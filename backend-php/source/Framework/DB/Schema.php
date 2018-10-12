<?php

namespace Framework\DB;

/**
 * Class Schema
 * @package Core\DB
 */
final class Schema {

    /**
     * @var array
     */
    protected $schema;

    /**
     * Schema constructor
     * @param array $schema
     */
    public function __construct(array $schema) {
		$this->schema = $schema;
	}

    /**
     * Get Public fields
     * @return array
     */
    public function getPublicFields(): array {
		return $this->getFields('public');
	}

    /**
     * Get fields by criteria
     * @param string|null $criteria
     * @return array
     */
    public function getFields(string $criteria = null): array {
		$result = [];
		foreach ($this->schema as $field => $data) {
			if($data[$criteria]) $result[] = $field;
		}
		return $result;
	}

	public function checkField(string $field, string $criteria): bool {
        return (bool)$this->schema[$field][$criteria];
    }

}
