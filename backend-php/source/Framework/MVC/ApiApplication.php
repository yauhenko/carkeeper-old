<?php

namespace Framework\MVC;

use Framework\Patterns\DI;
use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\Routing\{RequestContext, RouteCollection};
use Symfony\Component\HttpFoundation\{Request, Response};

class ApiApplication {

	/** @var DI */
	public $di;

	public function __construct() {
		$this->di = DI::getInstance();
        $this->di->app = $this;
	}

	public function run(): bool {

		/** @var Request $req */
		$req = $this->di->request;

		/** @var Response $res */
		$res = $this->di->response;

		$res->headers->set('Content-Type', 'application/json; charset: utf-8', true);
		$res->headers->set('Access-Control-Allow-Origin', '*', true);

		$uri = $req->getRequestUri();

        if(preg_match($this->di->config->static_regexp, $uri)) return false;

		try {

			/** @var RouteCollection $routes */
			$routes = $this->di->routes;
			$context = new RequestContext;
			$matcher = new UrlMatcher($routes, $context);
			$parameters = $matcher->match($req->getPathInfo());
			$this->di->params = $parameters;

			[$class, $method] = explode('::', $parameters['_controller']);

			/** @var AbstractController $controller */
			$controller = new $class;

			$result = call_user_func([$controller, $method]);
			if ($result instanceof Response) {
				$res = $result;
			} else {
				$res->setContent(json_encode(['result' => $result], JSON_UNESCAPED_UNICODE));
			}

        } catch (\Throwable $e) {

			if($e instanceof \Error) $res->setStatusCode(500);

			$res->setContent(json_encode(['error' => [
				'message' => $e->getMessage(),
				'code' => $e->getCode()
			]]));

        }

        $res->send();

		return true;
	}

}
