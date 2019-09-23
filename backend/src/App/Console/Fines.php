<?php

namespace App\Console;

use Exception;
use Framework\Mutex\FileMutex;
use Services\FinesService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class Fines extends Command {

	protected function configure(): void {
		$this->setName('fines');
		$this->setDescription('Starts Fines Worker');
		$this->addArgument('id', InputArgument::OPTIONAL, 'Worker id', 'car-fines-worker');
		$this->addOption('limit', null, InputOption::VALUE_OPTIONAL, 'Limit', 10);
	}

	protected function execute(InputInterface $input, OutputInterface $output): void {

		$io = new SymfonyStyle($input, $output);

		try {
			$mutex = new FileMutex($input->getArgument('id'));
		} catch (Exception $e) {
			if($output->isVerbose())
				$io->error($e->getMessage());
			return;
		}

		$srv = new FinesService;
		$srv->check((int)$input->getOption('limit'),
			function() use($mutex) {
				$mutex->update();
				return true;
			}
		);

		$mutex->free();

	}

}
