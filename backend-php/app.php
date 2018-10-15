<?php

use App\Services;
use Framework\MVC\ApiApplication;

error_reporting(E_ALL ^ E_NOTICE);

require __DIR__ . '/vendor/autoload.php';

$app = new ApiApplication();

Services::register();

return $app->run();
