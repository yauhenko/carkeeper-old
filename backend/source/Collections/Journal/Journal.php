<?php

namespace Collections\Journal;

use Entities\Journal\Record;
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
	protected $_entity = Record::class;

}
