<?php

namespace App\Console;

use Framework\Cache\CacheInterface;
use Framework\Patterns\DI;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class CacheFlush extends Command {

	protected function configure(): void {
		$this->setName('cache:flush');
		$this->setDescription('Flushes cache');
		$this->addOption('silent', null, InputOption::VALUE_OPTIONAL, 'Silent mode');
	}

	protected function execute(InputInterface $input, OutputInterface $output): void {

		$io = new SymfonyStyle($input, $output);
		$di = DI::getInstance();

		/** @var CacheInterface $rci */
		$rci = $di->get('cache:redis');
		$rci->flush();

		/** @var CacheInterface $fci */
		$fci = $di->get('cache:file');
		$fci->flush();

		if(!$input->getOption('silent'))
			$io->success('Cache flushed');

	}

}
