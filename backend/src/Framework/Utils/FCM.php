<?php

namespace Framework\Utils;

use Framework\Patterns\DI;

class FCM {

	public static function send($to, string $title, string $message, array $extra = [], bool $vibrate = true, bool $sound = true) {

		if(!is_array($to)) $to = [$to];
//
//		if($platform === 'android') {
//			$fields = [
//				'registration_ids' => $to,
//				'data' => [
//					'title' => $title,
//					'body' => $message,
//					'sound' => $sound ? 'default' : null,
//					'vibrate' => (int)$vibrate,
//				],
//			];
//			$fields['data'] += $extra;
//		} else {
			$fields = [
				'registration_ids' => $to,
				'notification' => [
					'title' => $title,
					'body' => $message,
					'sound' => $sound ? 'default' : null,
					'vibrate' => (int)$vibrate,
				],
				'data' => $extra
			];
		//}

		$key = DI::getInstance()->config->fcm->key;

		$headers = [
			'Authorization: key=' . $key,
			'Content-Type: application/json'
		];

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
		$result = curl_exec($ch);
		curl_close($ch);

		return json_decode($result, true);

	}

}
