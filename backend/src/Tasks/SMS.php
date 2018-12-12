<?php

namespace Tasks;

use Framework\MQ\Handler;
use Framework\Patterns\DI;
use Twilio\Rest\Client;

class SMS extends Handler {

	public function work(array $data) {
		$tel = preg_replace('/[^0-9]/', null, $data['tel']);
		if(preg_match('/^375/', $tel)) {
			$cfg = DI::getInstance()->config->sms_assistent;
			$client = new \GuzzleHttp\Client();
			$res = $client->request('POST', 'https://userarea.sms-assistent.by/api/v1/send_sms/plain', [
				'form_params' => [
					'user' => $cfg->user,
					'password' => $cfg->password,
					'recipient' => $tel,
					'sender' => $cfg->sender,
					'message' => $data['text'],
					'validity_period' => $cfg->validity_period ?: 24
				]
			]);
			if($res->getStatusCode() !== 200) throw new \Exception('Server Error ' . $res->getStatusCode());
			return (string)$res->getBody();
		} else {
			/** @var object $cfg */
			$cfg = DI::getInstance()->config->twilio;
			$twilio = new Client($cfg->sid, $cfg->token);
			return $twilio->messages->create("+{$tel}", [
				'from' => $cfg->from,
				'body' => $data['text']
			]);
		}
	}

}
