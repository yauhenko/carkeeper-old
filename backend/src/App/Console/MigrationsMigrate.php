<?php

namespace App\Console;

use Framework\DB\Client;
use Framework\DB\Errors\CommonError;
use Framework\Patterns\DI;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class MigrationsMigrate extends Command {

	protected function configure() {
		$this->setName('migrations:migrate')->setDescription('Apply all migrations');
	}

	protected function execute(InputInterface $input, OutputInterface $output) {
		$io = new SymfonyStyle($input, $output);
		$di = DI::getInstance();
		$dir = $di->root . '/migrations';
		if(!is_dir($dir)) {
			if(!mkdir($dir, 0755, true)) {
				$io->error(['Failed to create migrations folder', $dir]);
				return;
			}
		}

		/** @var Client $db */
		$db = DI::getInstance()->db;
		if (!$db->query('SHOW TABLES LIKE "versions"')[0]) {
			$io->text('<info>Creating versions table</>');
			$db->query('CREATE TABLE `versions` (`id` bigint(20) UNSIGNED NOT NULL, `cdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8');
			$db->query('ALTER TABLE `versions` ADD PRIMARY KEY (`id`)');
		}

		chdir($dir);
		$io->text('<info>Fetching versions list</>');
		$versions = $db->enum('SELECT id, cdate FROM versions ORDER BY id') ?: [];

		$io->text('<info>Starting migration process</>');
		foreach (glob('*.migration.sql') as $fn) {
			[$id] = explode('_', $fn, 2);
			if (!$versions[$id]) {
				$io->text("<fg=green>Applying migration: <fg=green;options=bold>{$fn}</>");
				$data = file_get_contents($fn);
				foreach (explode(';', $data) as $query) {
					if ($query = trim($query)) {
						if($input->getOption('verbose')) {
							$io->text("<fg=yellow>{$query}</>");
						}
						try {
							$db->query($query);
						} catch (CommonError $e) {
							$io->error(['Migration failed', $fn, $e->getMessage(), $e->getSql()]);
							return;
						}
					}
				}
				$db->insert('versions', ['id' => $id]);
				$db->query('COMMIT');
			} else {
				$io->text("<fg=blue>Skipping migration: <fg=blue;options=bold>{$fn}</>");
			}
		}

		$io->success('All migrations has been applied');

	}

}
