<?php

namespace Framework\MVC;

use Framework\Patterns\{DI, Singleton};
use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\Routing\{RequestContext, RouteCollection};
use Symfony\Component\HttpFoundation\{Request, Response};

class WebApplication {

    use Singleton;

	/** @var DI */
	public $di;

	public function __construct() {
		$this->di = DI::getInstance();
        $this->di->app = $this;
	}

	public function run(): bool {

		/** @var Request $req */
		$req = $this->di->request;
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

			/** @var Response $res */
			$res = call_user_func([$controller, $method]);

			if(!$res instanceof Response) {
                $res = Response::create('Empty response', 444);
            }

        } catch (\Throwable $e) {

			$code = $e->getCode() ?: 500;

			/** @var \Twig_Environment $twig */
            $twig = $this->di->twig;
            $res = new Response;
			if($code >= 200 && $code <= 599) $res->setStatusCode($code);
			else $res->setStatusCode(500);

            $html = $twig->render('error.twig', [
	            'message' => $e->getMessage() ?: 'Server made a boo..',
	            'code' => $code,
            ]);

            $res->setContent($html);

        }

        $res->send();

		return true;
	}

}
