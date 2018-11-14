<?php

namespace App\Console;

use App\Sessions;
use Framework\Cache\CacheInterface;
use Framework\Patterns\DI;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class Cleanup extends Command {

	protected function configure(): void {
		$this->setName('cleanup');
		$this->setDescription('Cleanup system');
		$this->addArgument('target', InputArgument::OPTIONAL, 'Target', 'all');
	}

	protected function execute(InputInterface $input, OutputInterface $output): void {
		$io = new SymfonyStyle($input, $output);

		$target = $input->getArgument('target');
		if($target === 'sessions' || $target === 'all') {
			Sessions::cleanup();
			if($output->isVerbose()) $io->success('Sessions cleared');
		}

	}

}
