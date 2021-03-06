<?php

namespace App\Console;

use App\Tools;
use Collections\Users;
use Framework\MQ\Task;
use Framework\DB\Client;
use Framework\Patterns\DI;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Tasks\Mail;
use Tasks\Push;

class NotifyCheckup extends Command {

	protected function configure(): void {
		$this->setName('notify:checkup');
		$this->setDescription('Sends checkup notifications');
	}

	protected function execute(InputInterface $input, OutputInterface $output): void {

		$io = new SymfonyStyle($input, $output);
		$di = DI::getInstance();

		/** @var Client $db */
		$db = $di->db;

		$sql = 'SELECT
			u.id,
			u.name, 
			u.fcm,
			u.email,
			CONCAT(cm.name, " ", cd.name, " (", c.year ,"г.)") car,
			ci.edate,
			TIMESTAMPDIFF(DAY, NOW(), edate) days
			
			FROM cars_checkup ci 
			INNER JOIN cars c ON c.id = ci.car
			INNER JOIN users u ON u.id = c.user 
			INNER JOIN car_mark cm ON cm.id = c.mark
			INNER JOIN car_model cd ON cd.id = c.model
			
			WHERE ci.notify = 1
			AND edate IS NOT NULL
			AND (TIMESTAMPDIFF(DAY, NOW(), edate) BETWEEN -7 AND 30)
		 		
		';

		$list = $db->query($sql);

		foreach ($list as $item) {

			$msg = "Через {$item['days']} " . Tools::plural($item['days'], ',день,дня,дней') . " истекает срок техосмотра";
			if($item['days'] === 30) $msg = "Через месяц истекает срок техосмотра";
			elseif($item['days'] === 14) $msg = "Через две недели истекает срок техосмотра";
			elseif($item['days'] === 7) $msg = "Через неделю истекает срок техосмотра";
			elseif($item['days'] === 2) $msg = "Послезавтра истекает срок техосмотра";
			elseif($item['days'] === 1) $msg = "Завтра истекает срок техосмотра";
			elseif($item['days'] === 0) $msg = "Сегодня истекает срок техосмотра";
			elseif($item['days'] < 0) $msg = "Истек срок техосмотра";

//			if($item['email']) {
//				Task::create([Mail::class, 'sendTpl'], [
//					'tpl' => 'mail/simple.twig',
//					'to' => $item['email'],
//					'user' => Users::factory()->get($item['id']),
//					'subject' => "Необходимо пройти техосмотр",
//					'html' => "<p>{$msg} вашего автомобиля <b>{$item['car']}</b></p>"
//				])->start();
//			}

			if($item['fcm']) {
				Task::create(Push::class, [
					'fcm' => $item['fcm'],
					'title' => $item['car'],
					'body' => $msg,
					'extra' => [
						'type' => 'checkup',
						'car' => $item['car'],
					]
				])->start();
			}

		}

		$io->success('Success');

	}

}
