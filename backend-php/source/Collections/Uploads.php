<?php

namespace Collections;

use Entities\Upload;
use Framework\DB\Collection;

/**
 * Class Uploads
 * @package Collections
 */
class Uploads extends Collection {

	/**
	 * @var string
	 */
	protected $_table = 'uploads';
	/**
	 * @var string
	 */
	protected $_entity = Upload::class;

}
