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
			$this->task->delete();
			return false;
		}
		return FCM::send($user->fcm, 'android', $data['title'], $data['body'], $data['extra'] ?: []);
	}

}
