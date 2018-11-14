<?php declare(strict_types=1);

namespace Framework\Mutex;

use Exception;

/**
 * Class FileMutex
 *
 * @package Framework\Mutex
 */
class FileMutex implements MutexInterface {

	/**
	 * Mutex file
	 * @var string
	 */
	protected $file;

	/**
	 * FileMutex constructor
	 *
	 * @param string $processId
	 * @throws Exception
	 */
	public function __construct(string $processId) {
		$this->file = '/dev/shm/mutex-' . md5($processId) . '.lock';
		if(file_exists($this->file) && file_get_contents($this->file) > time())
			throw new Exception('Mutex in use: ' . $processId);
		$this->update();
	}

	/**
	 * Destructor
	 */
	public function __destruct() {
		$this->free();
	}

	/**
	 * Renew mutex
	 *
	 * @param int $leaseTime
	 */
	public function update(int $leaseTime = 300): void {
		file_put_contents($this->file, time() + $leaseTime);
	}

	/**
	 * Free mutex
	 */
	public function free(): void {
		@unlink($this->file);
	}

}
