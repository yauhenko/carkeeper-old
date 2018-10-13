<?php

namespace Framework\MVC;

use Framework\Patterns\DI;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class Controller
 * @package Core
 */
abstract class AbstractController {

	/** @var DI */
	protected $di;

    /**
     * Controller constructor
     */
    public function __construct() {
	    $this->di = DI::getInstance();
    }

    /**
     * @param $data
     * @return Response
     * @throws \Exception
     */
    final public function json($data) {
    	/** @var Response $res */
	    $res = $this->di->response;
	    $res->headers->set('Content-Type', 'application/json; charset: utf-8', true);
	    $res->headers->set('Access-Control-Allow-Origin', '*', true);
	    $res->setContent(json_encode($data, JSON_UNESCAPED_UNICODE));
	    return $res;
	}

    /**
     * @param $data
     * @return Response
     * @throws \Exception
     */
    final public function jsonResult($data): Response {
	    return $this->json(['result' => $data]);
    }

    /**
     * @param string $message
     * @param int $code
     * @param mixed|null $context
     * @return Response
     * @throws \Exception
     */
    final public function jsonError(string $message, int $code = -1, $context = null): Response {
	    $error = ['message' => $message, 'code' => $code];
	    if($context) $error['context'] = $context;
	    return $this->json(['error' => $error]);
    }

    /**
     * @param string $template
     * @param array $context
     * @return Response
     * @throws \Twig_Error_Loader
     * @throws \Twig_Error_Runtime
     * @throws \Twig_Error_Syntax
     */
    final public function render(string $template, array $context = []): Response {
    	/** @var \Twig_Environment $twig */
        $twig = $this->di->twig;
        /** @var Response $res */
	    $res = $this->di->response;
	    $res->setContent($twig->render($template, $context));
	    return $res;
    }

}
