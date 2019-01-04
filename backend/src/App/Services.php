<?php

namespace App;

use Framework\Annotations\Parser;
use Framework\Annotations\Routes;
use Framework\Annotations\Validations;
use Framework\DB\Client;
use Framework\Cache\{File, Redis};
use Framework\Patterns\DI;
use Framework\Validation\Validator;
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

            $req = Request::createFromGlobals();
			$req->setTrustedProxies(['127.0.0.1', $req->getClientIp()], Request::HEADER_X_FORWARDED_ALL);

            return $req;

        })->set('response', function () {

            return Response::create();

        })->set('refs', function () {

        	return new References;

        })->set('routes', function () {

            return Routes::get();

        })->set('db', function (DI $di) {

            $cfg = $di->config->db;
            $db = new Client($cfg->host, $cfg->user, $cfg->pass, $cfg->name);
            $db->query('SET time_zone="+03:00"');
            return $db;

        })->set('twig', function (DI $di) {

            $loader = new FilesystemLoader($di->root . '/' . ($di->config->twig->path ?: 'views'));
            $twig = new Environment($loader, (array)$di->config->twig->options ?: []);
            $twig->mergeGlobals([
                'request', $di->request,
                'routes', $di->routes
            ]);
	        $twig->addExtension(new Twigext());
            return $twig;

        })->set('annotations', function () {

        	return new Parser([
		        __DIR__ . '/../Entities',
		        __DIR__ . '/../Collections',
		        __DIR__ . '/../Controllers',
	        ]);

        })->set('validations', function () {

			return new Validations;

        })->set('cache', function (DI $di) {

        	$driver = $di->config->cache->default ?: 'file';
	        return $di->get("cache:{$driver}");

        })->set('cache:redis', function (DI $di) {

        	return new Redis(
        		$di->config->cache->redis->host ?: 'locahost',
		        $di->config->cache->redis->port ?: 6379,
		        $di->config->cache->redis->prefix ?: null
	        );

        })->set('cache:file', function (DI $di) {

	        return new File(
	        	$di->config->cache->file->dir ?: '/dev/shm/cache-app',
		        $di->config->cache->file->factor ?: 1
	        );

        });

    }

    public static function locale() {
	    Validator::$names = [

	    	'tel' => 'Телефон',
		    'email' => 'E-mail',
		    'password' => 'Пароль',
		    'user.name' => 'Имя',
		    'city' => 'Город',
		    'fcm' => 'FCM',
		    'firstname' => 'Имя',
		    'middlename' => 'Отчество',
		    'lastname' => 'Фамилия',

		    'journal.car' => 'Идентификатор автомобиля',
		    'journal.date' => 'Дата записи',
		    'journal.odo' => 'Пробег',
		    'journal.type' => 'Тип записи',
		    'journal.comment' => 'Комментарий',

		    'mark' => 'Марка',
		    'model' => 'Модель',
		    'year' => 'Год выпуска',
		    'generation' => 'Поколение',
		    'serie' => 'Серия',
		    'modification' => 'Модификация',

		    'image' => 'Изображение',
		    'avatar' => 'Аватар',

		    'message' => 'Сообщение',

		    'pass.serie' => 'Серия',
		    'pass.number' => 'Номер',

		    'note.name' => 'Заголовок',
		    'note.content' => 'Текст заметки',
		    'note.image' => 'Изображение',

		    'pass.vu' => 'Водительское удостоверение',
		    'pass.sts' => 'Свидетельство о регистрации ТС',

		    'maintenance.name' => 'Название',
		    'maintenance.distance' => 'Пробег',
		    'maintenance.period' => 'Периодичность',

		    'code' => 'Код'

	    ];
    }


}
