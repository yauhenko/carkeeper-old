<?php declare(strict_types=1);

namespace Framework\MQ;

use Exception;
use Framework\DB\Client;
use Framework\Patterns\DI;

/**
 * Class Queue
 *
 * @package Core\MQ
 */
class Queue {

	/**
	 * Get next task
	 *
	 * @param string|null $class
	 * @param string|null $method
	 * @return Task|null
	 * @throws Exception
	 */
	public function getNextTask(string $class = null, string $method = null): ?Task {
		/** @var Client $db */
		$db = DI::getInstance()->db;
		$sql = 'SELECT * FROM `mq_tasks` WHERE `status` = "wait"
			AND `trigger` IS NULL AND (`sdate` IS NULL OR `sdate` <= NOW()) ';
		if($class) {
			$sql .= ' AND `class` = {$class} ';
			if($method) $sql .= ' AND `method` = {$method} ';
		}
		$sql .= ' ORDER BY `priority` DESC, `sdate` ASC, `id` ASC LIMIT 1';
		$data = $db->findOne($sql, [
			'class' => $class,
			'method' => $method
		]);
		if(!$data) return null;
		return new Task($data);
	}

	/**
	 * Run next task
	 *
	 * @param string|null $class
	 * @param string|null $method
	 * @return bool
	 * @throws Exception
	 */
	public function runNextTask(string $class = null, string $method = null): bool {
		if($task = $this->getNextTask($class, $method)) {
			$task->run();
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Run worker
	 *
	 * @param string|null $class
	 * @param string|null $method
	 * @param int $limit
	 * @param callable|null $tick
	 * @return bool
	 * @throws Exception
	 */
	public function runWorker(string $class = null, string $method = null, int $limit = 500, callable $tick = null): bool {
		for($counter = 1; $counter <= $limit; $counter++) {
			if(!$this->runNextTask($class, $method))
				sleep(1);
			if($tick) {
				$resume = $tick($counter, $limit);
				if(!$resume) return false;
			}
		}
		return true;
	}

	/**
	 * Start task by trigger
	 *
	 * @param string $trigger
	 * @param null $data
	 * @throws Exception
	 */
	public static function fire(string $trigger, $data = null): void {
		/** @var Client $db */
		$db = DI::getInstance()->db;
		$db->query('UPDATE `mq_tasks` SET `priority` = 5, `status` = "wait", `sdate` = NOW(), `trigger` = NULL, 
			`data_trigger` = {data}	WHERE `trigger` = {trigger}', ['trigger' => $trigger, 'data' => serialize($data)]);
	}

}
