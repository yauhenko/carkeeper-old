<?php

namespace App;

use Framework\Annotations\Parser;
use Framework\Annotations\Routes;
use Framework\DB\Client;
use Framework\Cache\{File, Redis};
use Framework\Patterns\DI;
use Symfony\Component\HttpFoundation\{Request, Response};
use Twig\Loader\FilesystemLoader;
use Twig\Environment;

/**
 * Services
 *
 * @package Core
 */
class Services {

	/**
	 * Register Services
	 *
	 * @throws \Exception
	 */
	public static function register() {

		$di = DI::getInstance();

		$di->root = realpath(__DIR__ . '/../../');
		$di->public = $di->root . '/public';

        $di->set('config', function (DI $di) {

            return json_decode(file_get_contents($di->root . '/config.json'));

        })->set('request', function () {

            return Request::createFromGlobals();

        })->set('response', function () {

            return Response::create();

        })->set('routes', function () {

            return Routes::get();

        })->set('db', function (DI $di) {

            $cfg = $di->config->db;
            return new Client($cfg->host, $cfg->user, $cfg->pass, $cfg->name);

        })->set('twig', function (DI $di) {

            $loader = new FilesystemLoader($di->root . '/' . ($di->config->twig->path ?: 'views'));
            $twig = new Environment($loader, (array)$di->config->twig->options ?: []);
            $twig->mergeGlobals([
                'app', $di->app,
                'request', $di->request,
                'routes', $di->routes
            ]);
	        $twig->addExtension(new Twigext());
            return $twig;

        })->set('annotations', function () {

        	return new Parser([
        		__DIR__ . '/../Entities',
        		__DIR__ . '/../Controllers',
        		__DIR__ . '/../Collections',
	        ]);

        })->set('cache', function (DI $di) {

        	$driver = $di->config->cache->default ?: 'file';
	        return $di->get("cache:{$driver}");

        })->set('cache:redis', function (DI $di) {

        	return new Redis(
        		$di->config->cache->redis->host ?: 'locahost',
		        $di->config->cache->redis->port ?: 6379
	        );

        })->set('cache:file', function (DI $di) {

	        return new File(
	        	$di->config->cache->file->dir ?: '/dev/shm/cache-app',
		        $di->config->cache->file->factor ?: 1
	        );

        });

    }

}
