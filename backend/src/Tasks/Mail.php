<?php

namespace Tasks;

use Framework\MQ\Handler;
use Framework\Patterns\DI;
use Mailgun\HttpClientConfigurator;
use Mailgun\Mailgun;

class Mail extends Handler {

	public function sendTpl(array $data) {
		$di = DI::getInstance();
		/** @var \Twig_Environment $twig */
		$twig = $di->twig;
		$data['html'] = $twig->render($data['tpl'], $data);
		return $this->send($data);
	}

	public function send(array $data) {
		$di = DI::getInstance();
		/** @var object $cfg */
		$cfg = $di->config;
		$mg = Mailgun::configure((new HttpClientConfigurator())->setApiKey($cfg->mailgun->key)->setEndpoint($cfg->mailgun->endpoint));
		return $mg->messages()->send($cfg->mailgun->domain, [
			'from' => $cfg->mailgun->sender,
			'to' => $data['to'],
			'subject' => $data['subj'],
			'html' => $data['html']
		]);
	}

}
