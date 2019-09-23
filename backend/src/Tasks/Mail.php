<?php

namespace Tasks;

use Framework\MQ\Handler;
use Framework\Patterns\DI;
use Mailgun\Mailgun;
use Twig\Environment;

class Mail extends Handler {

	public function sendTpl(array $data) {
		$di = DI::getInstance();
		/** @var Environment $twig */
		$twig = $di->twig;
		$data['html'] = $twig->render($data['tpl'], $data);
		return $this->send($data);
	}

	public function send(array $data) {
		if(!$data['to']) return 'No E-mail';
		$di = DI::getInstance();
		/** @var object $cfg */
		$cfg = $di->config;
		$mg = Mailgun::create($cfg->mailgun->key, $cfg->mailgun->endpoint);
		return $mg->messages()->send($cfg->mailgun->domain, [
			'from' => $cfg->mailgun->sender,
			'to' => $data['to'],
			'subject' => $data['subject'],
			'html' => $data['html']
		]);
	}

}
