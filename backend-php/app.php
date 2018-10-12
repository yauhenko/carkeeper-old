<?php

use App\Services;
use Framework\MVC\WebApplication;

error_reporting(E_ALL ^ E_NOTICE);

require __DIR__ . '/vendor/autoload.php';

$app = new WebApplication();

Services::register();

return $app->run();
