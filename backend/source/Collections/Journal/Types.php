<?php

namespace Collections\Journal;

use Entities\Journal\Type;
use Framework\DB\Collection;

/**
 * Class Types
 *
 * @package Collections\Journal
 */
class Types extends Collection {

	/**
	 * @var string
	 */
	protected $_table = 'journal_types';

	/**
	 * @var string
	 */
	protected $_entity = Type::class;

}
