<?php

namespace Collections;

use Entities\Upload;
use Framework\DB\Collection;

class Uploads extends Collection {

	protected $_table = 'uploads';
	protected $_entity = Upload::class;

}
