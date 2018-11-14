<?php

namespace Framework\MVC;

use Framework\Patterns\DI;
use Framework\Validation\Error;
use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\Routing\{Exception\ResourceNotFoundException, RequestContext, RouteCollection};
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

			try {
				$parameters = $matcher->match($req->getPathInfo());
			} catch (ResourceNotFoundException $e) {
				throw new \Error('Not found', 404);
			}

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

			$error = [
				'message' => $e->getMessage(),
				'code' => $e->getCode()
			];

			if($this->di->config->debug)
				$error['trace'] = $e->getTrace();

			if($e instanceof Error)
				$error['details'] = $e->getErrors();

			$res->setContent(json_encode(['error' => $error], JSON_UNESCAPED_UNICODE));

        }

        $res->send();

		return true;
	}

}
