<?php

use App\Services;
use Framework\MVC\ApiApplication;

//date_default_timezone_set('Europe/Minsk');

error_reporting(E_ALL ^ E_NOTICE);

require __DIR__ . '/vendor/autoload.php';

$app = new ApiApplication();

Services::locale();
Services::register();

return $app->run();
