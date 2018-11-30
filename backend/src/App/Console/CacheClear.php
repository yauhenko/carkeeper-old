<?php

namespace App\Console;

use Framework\Patterns\DI;
use Framework\Cache\CacheInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class CacheClear extends Command {

	protected function configure(): void {
		$this->setName('cache:clear');
		$this->setDescription('Clears cache');
		$this->addOption('redis', null, InputOption::VALUE_OPTIONAL, 'Flush Redis', false);
	}

	protected function execute(InputInterface $input, OutputInterface $output): void {

		$io = new SymfonyStyle($input, $output);
		$di = DI::getInstance();

		if($input->getOption('redis')) {
			/** @var CacheInterface $rci */
			$rci = $di->get('cache:redis');
			$rci->flush();
			$io->text('Redis cache cleared');
		}

		/** @var CacheInterface $fci */
		$fci = $di->get('cache:file');
		$fci->flush();
		$io->text('File cache cleared');

		$io->success('Cache cleared');

	}

}
