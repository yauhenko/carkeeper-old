<?php

namespace App\Console;

use Framework\DB\Client;
use Framework\Mutex\FileMutex;
use Framework\Patterns\DI;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use GuzzleHttp\Client as HttpClient;

class Autocard extends Command {

	protected function configure(): void {
		$this->setName('autocard');
		$this->setDescription('Autocard sumbmit');
		$this->addArgument('id', InputArgument::OPTIONAL, 'Worker id', 'autocard-worker');
		$this->addOption('limit', null, InputOption::VALUE_OPTIONAL, 'Limit', 10);
	}

	protected function execute(InputInterface $input, OutputInterface $output): void {

		$io = new SymfonyStyle($input, $output);
		$di = DI::getInstance();

		try {
			$mutex = new FileMutex($input->getArgument('id'));
		} catch (\Exception $e) {
			$io->error($e->getMessage());
			return;
		}

		$limit = (int)$input->getOption('limit');

		/** @var Client $db */
		$db = $di->db;

		$list = $db->find('SELECT * FROM autocard WHERE status = 0 ORDER BY id ASC LIMIT ' . $limit);

		$client = new HttpClient;
		foreach ($list as $o) {

			$mutex->update();

			$res = $client->request('POST', 'https://recard.by/ajax', [
				'form_params' => [
					'submitform' => 'submitform',
					'cid' => '1031',
					'surname' => $o['lastname'],
					'firstname' => $o['firstname'],
					'middlename' => $o['middlename'],
					'phone' => "+{$o['tel']}",
					'email' => $o['email'],
					'call' => 'sendLead',
					'extsite' => 'https://redstream.by'
				]
			]);

			$res = (string)$res->getBody();

			if($json = json_decode($res)) {
				if($json->finalstatus === 'OK') $status = 1;
				elseif($json->finalstatus === 'IgnoreSameLead') $status = 4;
				elseif($json->finalstatus === 'Unknown') $status = 2;
				else $status = 5;
			} else {
				$status = 6;
			}

			$db->update('autocard', ['status' => $status], 'id', $o['id']);

		}

		$mutex->free();
		$io->success('Success');

	}

}
