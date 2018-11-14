<?php

namespace App\Console;

use Framework\Patterns\DI;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class CacheWarmup extends Command {

	protected function configure(): void {
		$this->setName('cache:warmup');
		$this->setDescription('Clears and warms up cache');
	}

	protected function execute(InputInterface $input, OutputInterface $output): void {

		$this->getApplication()->find('cache:clear')->run(new ArrayInput(['-q' => true]), $output);

		$io = new SymfonyStyle($input, $output);
		$di = DI::getInstance();

		$di->get('annotations');
		$di->get('validations');
		$di->get('routes');

		$io->success('Cache warmed up');

	}

}
