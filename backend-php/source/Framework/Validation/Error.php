<?php

namespace Framework\Validation;

use Throwable;

class Error extends \Exception {

	public function __construct(string $message = "", int $code = 400, Throwable $previous = null) {
		parent::__construct($message, $code, $previous);
	}

}
