<?php

namespace Collections;

use Entities\Car;
use Framework\DB\Client;
use Framework\DB\Collection;
use Framework\Patterns\DI;
use App\Tools;

/**
 * Cars collection
 *
 * @package Collections
 */
class Cars extends Collection {

	/**
	 * @var string
	 */
	protected $_table = 'cars';

	/**
	 * @var string
	 */
	protected $_entity = Car::class;

	public function getNotifications(Car $car): array {
		$notifications = [];
		/** @var Client $db */
		$db = DI::getInstance()->db;

		// Страховка
		$ins = $db->query('SELECT *, TIMESTAMPDIFF(DAY, NOW(), edate) days FROM cars_insurance WHERE car = {$car} AND notify = 1', ['car' => $car->id]);
		if(!$ins) {
			$notifications[] = [
				'level' => 'info',
				'type' => 'insurance',
				'text' => 'Настройте получение уведомлений об истечении страховки'
			];
		} else {
			foreach ($ins as $i) {
				if($i['days'] <= 30 && $i['days'] >= -7) {
					$msg1 = 'Страховка' . ($i['type'] === 'casco' ? ' КАСКО' : '');
					$msg2 = 'истекает через ' . $i['days'] . ' ' . Tools::plural($i['days'], ',день,дня,дней');
					if($i['days'] === 30) $msg2 = 'истекает через месяц';
					elseif($i['days'] === 14) $msg2 = 'истекает через две недели';
					elseif($i['days'] === 7) $msg2 = 'истекает через неделю';
					elseif($i['days'] === 2) $msg2 = 'истекает послезавтра';
					elseif($i['days'] === 1) $msg2 = 'истекает завтра';
					elseif($i['days'] === 0) $msg2 = 'истекает сегодня';
					elseif($i['days'] < 0) $msg2 = 'уже истекла';
					$notifications[] = [
						'level' => $i['days'] > 3 ? 'warning' : 'danger',
						'type' => 'insurance',
						'text' => $msg1 . ' ' . $msg2
					];
				}
			}
		}

		// Техосмотр
		$i = $db->findOne('SELECT *, TIMESTAMPDIFF(DAY, NOW(), edate) days FROM cars_checkup WHERE car = {$car} AND notify = 1', ['car' => $car->id]);
		if(!$i) {
			$notifications[] = [
				'level' => 'info',
				'type' => 'checkup',
				'text' => 'Настройте получение уведомлений об истечении техосмотра'
			];
		} else {
			if($i['days'] <= 30 && $i['days'] >= -7) {
				$msg1 = 'Срок техосмотра';
				$msg2 = 'истекает через ' . $i['days'] . ' ' . Tools::plural($i['days'], ',день,дня,дней');
				if($i['days'] === 30) $msg2 = 'истекает через месяц';
				elseif($i['days'] === 14) $msg2 = 'истекает через две недели';
				elseif($i['days'] === 7) $msg2 = 'истекает через неделю';
				elseif($i['days'] === 2) $msg2 = 'истекает послезавтра';
				elseif($i['days'] === 1) $msg2 = 'истекает завтра';
				elseif($i['days'] === 0) $msg2 = 'истекает сегодня';
				elseif($i['days'] < 0) $msg2 = 'уже истек';
				$notifications[] = [
					'level' => $i['days'] > 3 ? 'warning' : 'danger',
					'type' => 'checkup',
					'text' => $msg1 . ' ' . $msg2
				];
			}
		}

		// Штрафы
		$pass = $db->findOne('SELECT * FROM cars_pass WHERE car = {$car}', ['car' => $car->id]);
		if(!$pass) {
			$notifications[] = [
				'level' => 'info',
				'type' => 'fines',
				'text' => 'Добавьте информацию о техпаспорте автомобиля, чтобы получать уведомления о штрафах'
			];
		}
		$cnt = $db->findOne('SELECT COUNT(*) cnt FROM cars_fines WHERE car = {$car} AND status = 0', ['car' => $car->id])['cnt'];
		if($cnt) {
			$notifications[] = [
				'level' => 'danger',
				'type' => 'fines',
				'text' => 'У вас ' . $cnt . ' ' . Tools::plural($cnt, 'неоплаченны,й,х,х штраф,,а,ов')
			];
		}
		return $notifications;

	}

}
