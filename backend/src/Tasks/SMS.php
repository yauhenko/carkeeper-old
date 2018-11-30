<?php

namespace Tasks;

use Framework\MQ\Handler;
use Framework\Patterns\DI;
use Twilio\Rest\Client;

class SMS extends Handler {

	public function work(array $data) {
		/** @var object $cfg */
		$cfg = DI::getInstance()->config->twilio;
		$tel = '+' . preg_replace('/[^0-9]/', null, $data['tel']);
		if(!preg_match('/^\+375(24|25|29|33|44)[0-9]{7}$/', $tel)) return false;
		$twilio = new Client($cfg->sid, $cfg->token);
		return $twilio->messages->create($tel, [
			'from' => $cfg->from,
			'body' => $data['text']
		]);
	}

}
