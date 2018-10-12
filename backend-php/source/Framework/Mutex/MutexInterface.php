<?php declare(strict_types=1);

namespace Framework\Mutex;

/**
 * Interface MutexInterface
 *
 * @package Framework\Mutex
 */
interface MutexInterface {

	/**
	 * MutexInterface constructor
	 *
	 * @param string $processId
	 */
	public function __construct(string $processId);

	/**
	 * Descructor
	 */
	public function __destruct();

	/**
	 * Update (renew) mutex
	 * @param int $leaseTime
	 */
	public function update(int $leaseTime = 300): void;

	/**
	 * Free mutex
	 */
	public function free(): void;

}
