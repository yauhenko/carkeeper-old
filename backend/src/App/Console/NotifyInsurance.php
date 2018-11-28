<?php

namespace App\Console;

use App\Tools;
use Collections\Users;
use Framework\DB\Client;
use Framework\MQ\Task;
use Framework\Patterns\DI;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Tasks\Mail;
use Tasks\Push;

class NotifyInsurance extends Command {

	protected function configure(): void {
		$this->setName('notify:insurance');
		$this->setDescription('Sends insurance notifications');
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
			ci.type,
			ci.edate,
			TIMESTAMPDIFF(DAY, NOW(), edate) days
			
			FROM cars_insurance ci 
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

			$type = $item['type'] === 'casco' ? ' КАСКО' : '';

			$msg = "Через {$item['days']} " . Tools::plural($item['days'], ',день,дня,дней') . " истекает страховка";
			if($item['days'] === 30) $msg = "Через месяц истекает страховка";
			elseif($item['days'] === 14) $msg = "Через две недели истекает страховка";
			elseif($item['days'] === 7) $msg = "Через неделю истекает страховка";
			elseif($item['days'] === 2) $msg = "Послезавтра истекает страховка";
			elseif($item['days'] === 1) $msg = "Завтра истекает страховка";
			elseif($item['days'] === 0) $msg = "Сегодня истекает страховка";
			elseif($item['days'] < 0) $msg = "Истекла страховка";

			if($item['email']) {
				Task::create([Mail::class, 'sendTpl'], [
					'tpl' => 'mail/simple.twig',
					'to' => $item['email'],
					'user' => Users::factory()->get($item['id']),
					'subject' => "Необходимо продлить страховку" . $type,
					'html' => "<p>{$msg}{$type} вашего автомобиля <b>{$item['car']}</b></p>"
				])->start();
			}

			if($item['fcm']) {
				Task::create(Push::class, [
					'fcm' => $item['fcm'],
					'title' => $item['car'],
					'body' => $msg . $type,
					'extra' => [
						'type' => 'insurance',
						'insurance' => [
							'car' => $item['car'],
							'type' => $item['type']
						]
					]
				])->start();
			}

		}

		$io->success('Success');

	}

}
