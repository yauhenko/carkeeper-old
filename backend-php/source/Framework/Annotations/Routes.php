<?php

namespace Framework\Annotations;

use Framework\Cache\CacheInterface;
use Framework\Patterns\DI;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

class Routes {

	public static function get(): RouteCollection {

		/** @var Parser $annotations */
		$annotations = DI::getInstance()->get('annotations');

		/** @var CacheInterface $ci */
		$ci = DI::getInstance()->get('cache:file');

		if($cache = $ci->get('routes')) {
			return $cache;
		}

		$routes = new RouteCollection();

		$n = 0;
		foreach ($annotations->getAll() as $class => $data) {
			foreach($data['methods'] as $method => $attr) {
				if($attr['route']) {
					$route = new Route($attr['route']['path'], ['_controller' => "{$class}::{$method}"]);
					$routes->add($attr['route']['name'] ?: 'unnamed_' . ++$n, $route);
				}
			}
		}

		$ci->set('routes', $routes, 3600);

		return $routes;

	}

}
