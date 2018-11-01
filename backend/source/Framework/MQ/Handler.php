<?php declare(strict_types=1);

namespace Framework\MQ;

/**
 * Class Handler
 * @package RS\MQ
 */
abstract class Handler {

	/**
	 * @var Task
	 */
	protected $task;

	/**
	 * Max errors
	 */
	public const MAX_ERRORS = 5;

	/**
	 * Delays between errors
	 */
	public const RETRY_DELAYS = [5, 60, 300, 1800, 3600];

	/**
	 * Handler constructor
	 * @param Task $task
	 */
	public function __construct(Task &$task) {
		$this->task = $task;
	}

}
