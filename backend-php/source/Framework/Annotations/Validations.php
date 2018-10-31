<?php

namespace Framework\Annotations;

use Framework\DB\Entity;
use Framework\Patterns\DI;
use Framework\Cache\CacheInterface;

class Validations {

	protected $data = [];

	public function __construct() {

		/** @var Parser $annotations */
		$annotations = DI::getInstance()->get('annotations');

		/** @var CacheInterface $ci */
		$ci = DI::getInstance()->get('cache:file');

		if($cache = $ci->get('validation')) {
			$this->data = $cache;
			return;
		}

		$data = [];

		foreach ($annotations->getAll() as $class => $sections) {
			if(!$sections['properties']) continue;

			foreach($sections['properties'] as $key => $attr) {
				if($attr['validate'])
					$data[$class][$key] = $attr['validate'];
			}
		}

		$ci->set('validation', $data, 3600);

	}

	public function getRules(Entity $entity): ?array {
		$class = get_class($entity);
		return $this->data[$class];
	}

}
