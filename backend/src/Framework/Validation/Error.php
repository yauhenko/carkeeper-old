<?php

namespace Framework\Validation;

use Exception;

/**
 * Class Error
 *
 * @package Framework\Validation
 */
class Error extends Exception {

	/**
	 * @var array
	 */
	protected $errors = [];

	/**
	 * Error constructor
	 *
	 * @param string $message
	 * @param int $code
	 * @param array $errors
	 */
	public function __construct(string $message, int $code = 400, array $errors = []) {
		parent::__construct($message, $code, null);
		$this->errors = $errors;
	}

	/**
	 * Get Errors
	 *
	 * @return array
	 */
	public function getErrors(): array {
		return $this->errors;
	}

}
