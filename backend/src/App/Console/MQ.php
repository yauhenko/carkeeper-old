<?php

namespace App\Console;

use Exception;
use Framework\MQ\Queue;
use Framework\Mutex\FileMutex;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class MQ extends Command {

	protected function configure(): void {
		$this->setName('mq');
		$this->setDescription('Starts MQ Worker');
		$this->addArgument('id', InputArgument::OPTIONAL, 'Worker id', 'mq-main-worker');
		$this->addOption('class', null, InputOption::VALUE_OPTIONAL, 'Class filter');
		$this->addOption('method', null, InputOption::VALUE_OPTIONAL, 'Method filter');
		$this->addOption('limit', null, InputOption::VALUE_OPTIONAL, 'Limit', 10);
	}

	protected function execute(InputInterface $input, OutputInterface $output): void {

		$io = new SymfonyStyle($input, $output);

		try {
			$mutex = new FileMutex($input->getArgument('id'));
		} catch (Exception $e) {
			if($input->getOption('verbose'))
				$io->error($e->getMessage());
			return;
		}

		$verbose = $output->isVerbose();
		$limit = (int)$input->getOption('limit');
		$class = $input->getOption('class');
		$method = $input->getOption('method');

		if($verbose) {
			$io->title('MQ Worker: ' . $input->getArgument('id'));
			if($class) $io->text('Class: ' . $class);
			if($method) $io->text('Method: ' . $method);
			$io->progressStart($limit);
		}

		$queue = new Queue;
		$queue->runWorker($class, $method, $limit,
			function() use($mutex, $verbose, $io) {
				$mutex->update();
				if($verbose) $io->progressAdvance();
				return true;
			}
		);

		if($verbose) {
			$io->progressFinish();
		}

		$mutex->free();

	}

}
