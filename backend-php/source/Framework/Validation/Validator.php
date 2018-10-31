<?php

namespace Framework\Validation;

use Framework\Annotations\Validations;
use Framework\DB\Entity;
use Framework\Patterns\DI;

class Validator {

	protected $errors = [];

	public function getErrors(): array {
		return $this->errors;
	}

	public static function validateEntity(Entity $entity, bool $silent = false): ?array {
		/** @var Validations $validations */
		$validations = DI::getInstance()->get('validations');
		$rules = $validations->getRules($entity);
		$validator = new self;
		$validator->validate($entity->getData() ?: [], $rules ?: [], $silent);
		return $validator->getErrors() ?: null;
	}

	/**
	 * @param object|array $data
	 * @param array $rules
	 * @param bool $silent
	 * @return array|null
	 * @throws Error
	 */
	public static function validateData($data, array $rules, bool $silent = false): ?array {
		$data = json_decode(json_encode($data), true);
		$validator = new self;
		$validator->validate($data, $rules, $silent);
		return $validator->getErrors() ?: null;
	}

	public function validate(array $data, array $rules, bool $silent = false, string $prefix = null): bool {
		foreach ($rules as $key => $validation) {
			$val = $data[$key];
			try {
				if(is_callable($validation)) {
					call_user_func($validation, $val);
				} else {
					if($val === null && !$validation['required']) continue;
					foreach ($validation as $name => $params) {
						if(is_callable($params)) {
							call_user_func($params, $val);
						} elseif($name === 'sub') {
							$this->validate($val, $params, true, $key . ':');
						} else {
							call_user_func([$this, 'check' . $name], $val, $params);
						}
					}
				}
			} catch (Error $e) {
				$this->errors[] = [
					'message' => $e->getMessage(),
					'key' => $prefix . $key,
				];
			}

		}
		if(!$prefix) {
			if(!$silent && $this->errors) throw new Error($this->errors[0]['message'] . ' (' . $this->errors[0]['key'] . ')');
		}
		return empty($this->errors);
	}

	protected function checkRequired($value, bool $required = true) {
		if($value === null && $required) throw new Error('Required');
	}

	protected function checkMin($value, $min) {
		if($value < $min) throw new Error('Value must be min: ' . $min);
	}

	protected function checkMax($value, $max) {
		if($value > $max) throw new Error('Value must be max: ' . $max);
	}

	protected function checkLength($value, $params) {
		if(is_array($params)) {
			[$min, $max] = $params;
		} else {
			$min = $max = $params;
		}
		$len = mb_strlen($value);
		if($min !== null && $len < $min) throw new Error('Length must be min ' . $min);
		if($max !== null && $len > $max) throw new Error('Length must be max ' . $max);
	}

	protected function checkType($value, $type): void  {
		$type = trim(strtolower($type));
		if($type === 'int') $type = 'integer';
		elseif($type === 'bool') $type = 'boolean';
		elseif($type === 'float') $type = 'double';
		if(gettype($value) !== $type)
			throw new Error('Invalid type. Expected ' . $type);
	}

	protected function checkIn($value, $variants): void  {
		if(!in_array($value, $variants))
			throw new Error('Invalid value. Expected ' . implode(', ', $variants));
	}

	protected function checkMatch($value, $pattern): void  {
		if(!preg_match($pattern, $value))
			throw new Error('Invalid format');
	}

	protected function checkEmail($email): void  {
		if(!filter_var($email, FILTER_VALIDATE_EMAIL))
			throw new Error('Invalid email');
	}

	protected function checkIP($ip): void  {
		if(!filter_var($ip, FILTER_VALIDATE_IP))
			throw new Error('Invalid IP');
	}

	protected function checkDomain($domain): void  {
		if(!filter_var($domain, FILTER_VALIDATE_DOMAIN))
			throw new Error('Invalid domain');
	}

	protected function checkURL($url): void {
		if(!filter_var($url, FILTER_VALIDATE_URL))
			throw new Error('Invalid URL');
	}

	protected function checkDate($date): void {
		if(preg_match('/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/', $date))
			throw new Error('Invalid Date format');
	}

	protected function checkDateTime($value): void {
		if(preg_match('/^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/', $value))
			throw new Error('Invalid DateTime format');
	}

	protected function checkUUID($value): void {
		if(preg_match('/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i', $value))
			throw new Error('Invalid UUID');
	}

	protected function checkFilter($value, $filter): void {
		$this->{"check{$filter}"}($value);
	}

}
