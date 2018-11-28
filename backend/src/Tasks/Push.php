<?php

namespace Tasks;

use Entities\User;
use Collections\Users;
use Framework\MQ\Handler;
use Framework\Utils\FCM;

class Push extends Handler {

	public function work(array $data) {

		$user = null;

		if(is_object($data['user'])) {
			/** @var User $user */
			$user = $data['user'];
			$data['fcm'] = $user->fcm;

		} elseif (is_numeric($data['user'])) {
			/** @var User $user */
			$user = Users::factory()->get($data['user']);
			$data['fcm'] = $user->fcm;
		}

		if(!$data['fcm']) {
			return 'No FCM';
		}

		$res = FCM::send($data['fcm'], 'android', $data['title'], $data['body'], (array)$data['extra'] ?: []);

		if($res['failure']) {

			if(!$user) $user = Users::factory()->findOneBy('fcm', $data['fcm']);
			$user->fcm = null;
			$user->save();

			return $res;

		} elseif($res['success']) {

			return $res;

		}

		return $res;

	}

}
