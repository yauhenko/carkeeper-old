<?php declare(strict_types=1);

namespace App;

use Framework\MQ\Queue;
use Framework\DB\Client;
use Framework\DB\Errors\CommonError;
use Framework\Mutex\FileMutex;
use Framework\Cache\CacheInterface;
use Framework\MVC\AbstractConsoleApplication;
use Framework\Patterns\DI;

class Console extends AbstractConsoleApplication {

	public function cache() {
		$this->println("<b>Cache Manager</>");
		$cmd = $this->args[2];

		if($cmd === 'flush') {
			$this->cacheFlush();

		} elseif($cmd === 'warm') {
			$this->cacheFlush();
			$this->di->get('annotations');
			$this->di->get('validations');
			$this->di->get('routes');
			$this->println('<b><green>[OK]<n> Cache warmed</>');

		} elseif ($cmd === 'dump') {

			if(!$key = $this->args[3]) {
				$this->error("Key is not specified.\n<yellow>Type <b>./bin/console cache dump KEY</>");
			}

			$driver = $this->params['driver'] ? "cache:{$this->params['driver']}" : 'cache';

			/** @var CacheInterface $ci */
			$ci = $this->di->get($driver);

			$this->print("<green>{$driver} -> <b>{$key}:</> <yellow>");

			if($data = $ci->get($key)) {
				$this->println(print_r($data, true));
			} else {
				$this->println('(empty)');
			}

			$this->print('</>');

		} else {
			$this->println("<yellow>Usage: <b>./bin/console cache [flush|warm|dump]</>");
		}

	}

	private function cacheFlush() {
		/** @var CacheInterface $rci */
		$rci = $this->di->get('cache:redis');
		$rci->flush();
		/** @var CacheInterface $fci */
		$fci = $this->di->get('cache:file');
		$fci->flush();
		$this->println('<b><green>[OK]<n> Cache flushed</>');
	}

	public function mq() {
		try {
			$mutex = new FileMutex($this->params['worker'] ?: 'default-worker');
		} catch (\Exception $e) {
			if(!$this->params['silent'])
				$this->error($e->getMessage());
			return;
		}
		$queue = new Queue;
		$queue->runWorker(
			$this->params['class'],
			$this->params['method'],
			(int)$this->params['limit'] ?: 10,
			function() use($mutex) {
				$mutex->update();
			}
		);
		$mutex->free();
	}

	public function migrations() {
		$this->println("<b>Migrations Manager</>");
		$cmd = $this->args[2];

		$dir = $this->di->root . '/migrations';
		if(!is_dir($dir)) {
			if(!mkdir($dir, 0755, true))
				$this->error("Failed to create migrations dir: <b>{$dir}</>");
		}

		if($cmd === 'create') {

			$name = str_replace(' ', '_', strtolower($this->params['name'] ?: 'No name'));
			$id = date('YmdHis');
			$fn = $id . '_' . $name. '.migration.sql';
			file_put_contents("{$dir}/{$fn}", "/* {$this->params['name']} */\n\n");
			$this->println("<green>[✓] Migration stub created: <b>{$fn}</>");

		} elseif($cmd === 'migrate') {

			/** @var Client $db */
			$db = DI::getInstance()->db;
			if (!$db->query('SHOW TABLES LIKE "versions"')[0]) {
				$this->print('<yellow>[i] Creating versions table... ');
				$db->query('CREATE TABLE `versions` (`id` bigint(20) UNSIGNED NOT NULL, `cdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8');
				$db->query('ALTER TABLE `versions` ADD PRIMARY KEY (`id`)');
				$this->println('<green><b>[OK]</>');
			}

			chdir($dir);
			$this->print('<yellow>[i] Fetching versions list... ');
			$versions = $db->enum('SELECT id, cdate FROM versions ORDER BY id') ?: [];
			$this->println('<green><b>[OK]</>');

			$this->println('<green><b>[*] Starting migration process...</>');
			foreach (glob('*.migration.sql') as $fn) {
				[$id] = explode('_', $fn, 2);
				if (!$versions[$id]) {
					$this->println("<green>[+] Applying migration: <b>{$fn}</>");
					$data = file_get_contents($fn);
					foreach (explode(';', $data) as $query) {
						if ($query = trim($query)) {
							if($this->params['verbose']) {
								$this->println("<yellow>[>] <b>{$query}</>");
							}
							try {
								$db->query($query);
							} catch (CommonError $e) {
								$this->error('Migration {$fn} failed: <b>' . $e->getMessage());
								return;
							}
						}
					}
					$db->insert('versions', ['id' => $id]);
					$db->query('COMMIT');
				} else {
					$this->println("<blue>[-] Skipping migration: <b>{$fn}</>");
				}
			}
			$this->println("<green><b>[✓] All migrations has been applied</>");

		} else {

			$this->println("<yellow>Usage:<b>");
			$this->println("./bin/console migrations create [--name=\"Migration name\"]");
			$this->println("./bin/console migrations migrate</>");

		}

	}

	public function cleanup() {
		$this->println("<b>Cleanup Manager</>");
		$cmd = $this->args[2];
		if($cmd === 'sessions' || $cmd == 'all') {
			Sessions::cleanup();
			$this->println("<green><b>[OK]</> <yellow>Sessions cleaned</>");
		}
	}

}
