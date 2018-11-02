<?php declare(strict_types=1);

namespace Framework\MQ;

use Framework\DB\Client;
use Framework\Patterns\DI;
use Exception, Throwable;

/**
 * Class Task
 *
 * @package Core\MQ
 */
class Task {

	/**
	 * Task fields list
	 */
	protected const TASK_FIELDS = ['id', 'priority', 'class', 'method', 'trigger', 'status',
		'errors', 'data', 'data_trigger', 'result', 'cdate', 'mdate', 'sdate'];

	/**
	 * @var array
	 */
	protected $_data = [];

	/**
	 * @var array
	 */
	protected $_buffer = [];

	/** @var int Priorities */
	public const PRIORITY_LOWEST  = 1;
	public const PRIORITY_LOW     = 2;
	public const PRIORITY_MEDIUM  = 3;
	public const PRIORITY_HIGH    = 4;
	public const PRIORITY_HIGHEST = 5;

	/**
	 * Task constructor
	 *
	 * @param array $data
	 */
	public function __construct(array $data) {
		$this->_data = $data;
	}

	/**
	 * Get task by Id
	 *
	 * @param int $id
	 * @return Task
	 * @throws Exception
	 */
	public static function get(int $id): self {
		/** @var Client $db */
		$db = DI::getInstance()->db;
		if(!$data = $db->findOneBy('mq_tasks', 'id', $id))
			throw new Exception('Task not found: #' . $id);
		return new self($data);
	}

	/**
	 * Create new task
	 *
	 * @param $handler
	 * @param mixed $data
	 * @param int $priority
	 * @return Task
	 * @throws Exception
	 */
	public static function create($handler, $data = null, int $priority = self::PRIORITY_MEDIUM): self {
		if(is_string($handler)) $handler = explode('::', $handler);
		elseif(!is_array($handler)) throw new Exception('Invalid handler');
		[$class, $method] = $handler;
		if(!$method) $method = 'work';
		if(!class_exists($class))
			throw new Exception("Class {$class} does not exists");
		if(!in_array($method, get_class_methods($class)))
			throw new Exception("Method {$class}::{$method}() does not exists");
		if($priority < 1) $priority = 1;
		if($priority > 5) $priority = 5;
		/** @var Client $db */
		$db = DI::getInstance()->db;
		$id = $db->insert('mq_tasks', [
			'class' => $class,
			'method' => $method,
			'data' => serialize($data),
			'priority' => $priority,
			'cdate' => date('Y-m-d H:i:s'),
		]);
		return self::get($id);
	}


	/**
	 * Set task priority
	 *
	 * @param int $priority
	 * @return $this
	 */
	public function setPriority(int $priority) {
		$this->priority = $priority;
		return $this;
	}

	/**
	 * Add task to queue
	 *
	 * @return Task
	 * @throws Exception
	 */
	public function start(): self {
		$this->status = 'wait';
		$this->save();
		return $this;
	}

	/**
	 * Scheldue task
	 *
	 * @param string $date
	 * @return Task
	 * @throws Exception
	 */
	public function startAt(string $date): self {
		$this->sdate = $date;
		$this->start();
		return $this;
	}

	/**
	 * Start task with delay
	 *
	 * @param int $delay
	 * @return Task
	 * @throws Exception
	 */
	public function startDelay(int $delay): self {
		$date = date('Y-m-d H:i:s', time() + $delay);
		$this->startAt($date);
		return $this;
	}

	/**
	 * Scheldue task on trigger
	 *
	 * @param string $trigger
	 * @return Task
	 * @throws Exception
	 */
	public function startOn(string $trigger): self {
		$this->trigger = $trigger;
		$this->start();
		return $this;
	}

	/**
	 * Run task
	 *
	 * @throws Exception
	 */
	public function run(): void {
		/** @var Client $db */
		$db = DI::getInstance()->db;
		if(!$db->update('mq_tasks', ['status' => 'working'], 'id', $this->id)) return;
		try {
			$handler = $this->getHandler();
			$method = $this->method;
			$result = $handler->$method($this->data, $this->data_trigger);
			if($result instanceof self) return;
			$this->result = $result;
			$this->status = 'done';
		} catch (Throwable $error) {
			$this->errors++;
			$this->result = $error;
			if(isset($handler) && $handler::MAX_ERRORS > $this->errors) {
				$delay = $handler::RETRY_DELAYS[$this->errors - 1] ?: max($handler::RETRY_DELAYS);
				$this->startDelay($delay);
			} else {
				$this->status = 'failed';
			}
		}
		$this->save();
	}

	/**
	 * Get task handler object
	 *
	 * @return Handler
	 */
	public function getHandler(): Handler {
		$class = $this->class;
		return new $class($this);
	}

	/**
	 * Save task
	 *
	 * @throws Exception
	 */
	public function save(): void {
		if(empty($this->_buffer)) return;
		$this->mdate = date('Y-m-d H:i:s');
		/** @var Client $db */
		$db = DI::getInstance()->db;
		$db->update('mq_tasks', $this->_buffer, 'id', $this->id);
		$this->_buffer = [];
	}

	/**
	 * Delete task
	 *
	 * @throws Exception
	 */
	public function delete(): void {
		$this->db->delete('mq_tasks', 'id', $this->id);
		$this->id = null;
		$this->_data = $this->_buffer = [];
	}

	/**
	 * Magic getter
	 *
	 * @param string $name
	 * @return mixed
	 */
	public function __get(string $name) {
		$name = strtolower($name);
		$value = $this->_data[$name];
		if(in_array($name, ['data', 'data_trigger', 'result']))
			$value = $value ? unserialize($value) : null;
		return $value;
	}

	/**
	 * Magic setter
	 *
	 * @param string $name
	 * @param $value
	 * @throws Exception
	 */
	public function __set(string $name, $value): void {
		$name = strtolower($name);
		if(!in_array($name, self::TASK_FIELDS))
			throw new Exception('Unknown task property: ' . $name);
		if($name === 'priority') {
			if($value < 1) $value = 1;
			if($value > 5) $value = 5;
		}
		if(in_array($name, ['data', 'data_trigger', 'result']))
			$value = serialize($value);
		$this->_data[$name] = $this->_buffer[$name] = $value;
	}

	/**
	 * Magic caller
	 *
	 * @param string $name
	 * @param array $args
	 * @return $this|mixed
	 * @throws Exception
	 */
	public function __call(string $name, array $args) {
		$name = strtolower($name);
		if(substr($name, 0, 3) === 'get') {
			$key = substr($name, 3);
			return $this->{$key};
		} elseif(substr($name, 0, 3) === 'set') {
			$key = substr($name, 3);
			$this->{$key} = $args[0];
			return $this;
		} else {
			throw new Exception('Unknown method: ' . $name);
		}
	}

}
