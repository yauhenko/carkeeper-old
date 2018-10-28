<?php

namespace Collections;

use Entities\JournalRecord;
use Framework\DB\Collection;

/**
 * Journal Collection
 *
 * @package Collections
 */
class Journal extends Collection {

	/**
	 * @var string
	 */
	protected $_table = 'journal';

	/**
	 * @var string
	 */
	protected $_entity = JournalRecord::class;

}
