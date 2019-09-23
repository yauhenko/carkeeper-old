<?php

namespace App\Console;

use Framework\Patterns\DI;
use RuntimeException;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class MigrationsCreate extends Command {

	protected function configure(): void {
		$this->setName('migrations:create');
		$this->setDescription('Create new migration stub');
		$this->addArgument('name', InputArgument::OPTIONAL, 'Migration name');
	}

	protected function execute(InputInterface $input, OutputInterface $output): void {
		$io = new SymfonyStyle($input, $output);
		$di = DI::getInstance();
		$dir = $di->root . '/migrations';
		if(!is_dir($dir)) {
			if(!mkdir($dir, 0755, true)) {
				$io->error(['Failed to create migrations folder', $dir]);
				return;
			}
		}
		$name = $input->getArgument('name');
		if(!$name) $name = $io->ask('Migration name', null, function($name) {
			if(empty($name)) throw new RuntimeException('Migration name must be not empty');
			return (string)$name;
		});
		$slug = str_replace(' ', '_', strtolower($name));
		$id = date('YmdHis');
		$fn = $id . '_' . $slug. '.migration.sql';
		file_put_contents("{$dir}/{$fn}", "/* {$name} */\n\n");
		$io->success(['Migration stub created', $fn]);
	}

}
