<?php

namespace Framework\Validation;

use Framework\DB\Entity;
use Framework\Patterns\DI;
use Framework\Annotations\Validations;

/**
 * Class Validator
 * @package Framework\Validation
 */
class Validator {

	/**
	 * @var array
	 */
	public static $names = [];

	/**
	 * @var array
	 */
	protected $errors = [];

	/**
	 * @return array
	 */
	public function getErrors(): array {
		return $this->errors;
	}

	/**
	 * @param Entity $entity
	 * @param bool $silent
	 * @return array|null
	 * @throws Error
	 */
	public static function validateEntity(Entity $entity, bool $silent = false): ?array {
		/** @var Validations $validations */
		$validations = DI::getInstance()->get('validations');
		$rules = $validations->getRules($entity);
		$validator = new self;
		$prefix = strtolower(end(explode('\\', get_class($entity))));
		$validator->validate($entity->getData() ?: [], $rules ?: [], $silent, $prefix);
		return $validator->getErrors() ?: null;
	}

	/**
	 * @param object|array $data
	 * @param array $rules
	 * @param bool $silent
	 * @param string $prefix
	 * @return array|null
	 * @throws Error
	 */
	public static function validateData($data, array $rules, bool $silent = false, string $prefix = ''): ?array {
		$data = json_decode(json_encode($data), true);
		$validator = new self;
		$validator->validate($data, $rules, $silent, $prefix);
		return $validator->getErrors() ?: null;
	}

	/**
	 * @param array $data
	 * @param array $rules
	 * @param bool $silent
	 * @param string|null $prefix
	 * @param bool $sub
	 * @return bool
	 * @throws Error
	 */
	public function validate(array $data, array $rules, bool $silent = false, string $prefix = null, bool $sub = false): bool {
		if($prefix) $prefix .= '.';
		foreach ($rules as $key => $validation) {
			$val = $data[$key];
			$name = 'custom';
			try {
				if(is_callable($validation)) {
					call_user_func($validation, $val);
				} else {
					if(($val === null || $val === '') && !$validation['required']) continue;
					foreach ($validation as $name => $params) {
						if(is_callable($params)) {
							call_user_func($params, $val);
						} elseif($name === 'sub') {
							$this->validate($val, $params, true, $key, true);
						} elseif(method_exists($this, 'check' . $name)) {
							call_user_func_array([$this, 'check' . $name], array_merge([$val], is_array($params) ? $params : [$params]));
						} else {
							throw new Error('Unknown validation filter: ' . $name);
						}
					}
				}
			} catch (Error $e) {
				$this->errors[] = [
					'key' => $prefix . $key,
					'value' => $val,
					'rule' => $name,
					'message' => $e->getMessage(),
				];
			}
		}
		if(!$sub) {
			$key = $this->errors[0]['key'];
			if(!$name = self::$names[$key]) {
				$name = explode('.', $key);
				if(!$name = self::$names[end($name)]) {
					$name = mb_convert_case(str_replace('.', ' ', $key), MB_CASE_TITLE, 'UTF-8');
				}
			}
			$message = $this->errors[0]['message'];
			if(!$silent && $this->errors) throw new Error($name . ' — ' . mb_strtolower($message, 'UTF-8'), 400, $this->errors);
		}
		return empty($this->errors);
	}

	/**
	 * @param $value
	 * @param bool $required
	 * @throws Error
	 */
	protected function checkRequired($value, bool $required = true) {
		if(($value === null || $value === '') && $required) throw new Error('Обязательное поле');
	}

	/**
	 * @param $value
	 * @param $min
	 * @throws Error
	 */
	protected function checkMin($value, $min) {
		if($value < $min) throw new Error('Значение должно быть больше ' . $min);
	}

	/**
	 * @param $value
	 * @param $max
	 * @throws Error
	 */
	protected function checkMax($value, $max) {
		if($value > $max) throw new Error('Значение должно быть меньше ' . $max);
	}

	/**
	 * @param $value
	 * @param $min
	 * @param $max
	 * @throws Error
	 */
	protected function checkLength($value, $min, $max = null) {
		if(!$max) $max = $min;
		$len = mb_strlen($value);
		if($min !== null && $len < $min) throw new Error('Длина должна быть не менее ' . $min);
		if($max !== null && $len > $max) throw new Error('Длина должна быть не более ' . $max);
	}

	/**
	 * @param $value
	 * @param $type
	 * @throws Error
	 */
	protected function checkType($value, $type): void {
		if(!is_array($type)) $type = [$type];
		foreach ($type as &$t) {
			$t = strtolower($t);
			if($t === 'int') $t = 'integer';
			elseif($t === 'bool') $t = 'boolean';
			elseif($t === 'float') $t = 'double';
			if($t === 'boolean' && in_array($value, [0, 1])) $value = (bool)$value;
			if($t === 'struct') {
				$type[] = 'object';
				$type[] = 'array';
			}
		}
		if(!in_array(strtolower(gettype($value)), $type))
			throw new Error('Неверный тип данных. Ожидается: ' . implode(', ', $type));
	}

	/**
	 * @throws Error
	 */
	protected function checkIn(): void {
		$args = func_get_args();
		$value = array_shift($args);
		if(!in_array($value, $args))
			throw new Error('Неверное значение. Ожидается одно из: ' . implode(', ', $args));
	}

	/**
	 * @param $value
	 * @param $pattern
	 * @throws Error
	 */
	protected function checkMatch($value, $pattern): void {
		if(!preg_match($pattern, $value))
			throw new Error('Неверный формат');
	}

	/**
	 * @param $email
	 * @throws Error
	 */
	protected function checkEmail($email): void {
		if(!filter_var($email, FILTER_VALIDATE_EMAIL))
			throw new Error('Неверный формат E-mail');
	}

	/**
	 * @param $ip
	 * @throws Error
	 */
	protected function checkIP($ip): void {
		if(!filter_var($ip, FILTER_VALIDATE_IP))
			throw new Error('Неверный формат IP');
	}

	/**
	 * @param $domain
	 * @throws Error
	 */
	protected function checkDomain($domain): void {
		if(!filter_var($domain, FILTER_VALIDATE_DOMAIN))
			throw new Error('Неверный формат домена');
	}

	/**
	 * @param $url
	 * @throws Error
	 */
	protected function checkURL($url): void {
		if(!filter_var($url, FILTER_VALIDATE_URL))
			throw new Error('Неверный формат URL');
	}

	/**
	 * @param $date
	 * @throws Error
	 */
	protected function checkDate($date): void {
		if(!preg_match('/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/', $date))
			throw new Error('Неверный формат даты');
	}

	/**
	 * @param $value
	 * @throws Error
	 */
	protected function checkDateTime($value): void {
		if(!preg_match('/^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/', $value))
			throw new Error('Неверный формат даты и времени');
	}

	/**
	 * @param $value
	 * @throws Error
	 */
	protected function checkUUID($value): void {
		if(!preg_match('/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i', $value))
			throw new Error('Неверный формат UUID');
	}

	/**
	 * @param $value
	 * @param $filter
	 */
	protected function checkFilter($value, $filter): void {
		$this->{"check{$filter}"}($value);
	}

}
