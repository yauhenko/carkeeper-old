<?php

namespace Tasks;

use Entities\User;
use Collections\Users;
use Framework\MQ\Handler;
use Framework\Utils\FCM;

class Push extends Handler {

	public function work(array $data) {

		$user = null;
		$auth = true;

		if(is_object($data['user'])) {
			/** @var User $user */
			$user = $data['user'];
			$data['fcm'] = $user->fcm;
			$auth = (bool)$user->fcm_auth;

		} elseif (is_numeric($data['user'])) {
			/** @var User $user */
			$user = Users::factory()->get($data['user']);
			$data['fcm'] = $user->fcm;
			$auth = (bool)$user->fcm_auth;
		}

		if(!$data['fcm']) {
			return 'No FCM';
		}

		if(!$auth && !$data['force']) {
			return 'No Auth';
		}

		$res = FCM::send($data['fcm'], $data['title'], $data['body'] ?: $data['message'], (array)$data['extra'] ?: null);

		if($res && $res['failure']) {

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
