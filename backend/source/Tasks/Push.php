<?php

namespace Tasks;

use Collections\Users;
use Entities\User;
use Framework\MQ\Handler;
use Framework\Utils\FCM;

class Push extends Handler {

	public function work(array $data) {

		$users = new Users;

		/** @var User $user */
		$user = $users->get($data['user']);

		if(!$user->fcm) {
			//$this->task->delete();
			return 'No FCM';
		}

		$res = FCM::send($user->fcm, 'android', $data['title'], $data['message'], $data['extra'] ?: []);

		if($res['failure']) {
			$user->fcm = null;
			$user->save();
			return $res;
			//$this->task->delete();

		} elseif($res['success']) {
			$this->task->delete();
			return 'SUCCESS!';
			//return true;

		}

		return $res;

	}

}
