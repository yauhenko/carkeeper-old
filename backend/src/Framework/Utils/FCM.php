<?php

namespace Framework\Utils;

use Framework\Patterns\DI;

class FCM {

	public static function send($to, string $title, string $body, array $extra = null, bool $vibrate = true, bool $sound = true) {

		if(!is_array($to)) $to = [$to];

		$fields = [
			'registration_ids' => $to,
			'notification' => [
				'title' => $title,
				'body' => $body,
				'sound' => $sound ? 'default' : null,
				'vibrate' => (int)$vibrate,
			],
			'data' => $extra
		];

		$headers = [
			'Authorization: key=' . DI::getInstance()->config->fcm->key,
			'Content-Type: application/json'
		];

		$ch = curl_init();

		curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
		$result = curl_exec($ch);

		curl_close($ch);

		return json_decode($result, true) ?: false;

	}

}
