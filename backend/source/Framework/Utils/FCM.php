<?php

namespace Framework\Utils;

class FCM {

	protected static $key = 'AAAAl7VqnrU:APA91bGe3PcWhZWhs6hkJgamkY2TVawBEASMFrn9eql-c2h3YxV79oe4sxgAYZJ-EgOBNy_11Gpsw9DdkD-KnoBbIV8i1oW4HDC1kVJKRjGmHPQhV0w2jVIjoeCqj6kkTmp2aQOOZjwP';

	public static function send($to, string $platform, string $title, string $message, array $extra = [], bool $vibrate = true, bool $sound = true) {

		if(!is_array($to)) $to = [$to];

		if($platform === 'android') {
			$fields = [
				'registration_ids' => $to,
				'data' => [
					'title' => $title,
					'body' => $message,
					'sound' => $sound ? 'default' : null,
					'vibrate' => (int)$vibrate,
				],
			];
			$fields['data'] += $extra;
		} else {
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
		}

		$headers = [
			'Authorization: key=' . self::$key,
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

if(!$_REQUEST['to']) return false;

echo '<pre>';


$r = FCM::send($_GET['to'], 'android', $_REQUEST['title'] ?: 'CarKeeper', $_REQUEST['body'] ?: 'Новый штраф', $_REQUEST['data'] ?: [
	'event_type' => 'Штраф',
	'штраф_id' => 213,
	'car_id' => 123
]);

print_r($r);
