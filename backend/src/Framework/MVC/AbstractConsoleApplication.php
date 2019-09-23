<?php declare(strict_types=1);

namespace Framework\MVC;

use Exception;
use Framework\Patterns\DI;
use Throwable;

/**
 * Class AbstractConsoleApplication
 * @package Framework\MVC
 */
abstract class AbstractConsoleApplication {

	/**
	 * @var
	 */
	protected $args;
	/**
	 * @var
	 */
	protected $params;

	/** @var DI */
	protected $di;

	/**
	 *
	 */
	protected const ATTRS = [
		'n' => 0, # Normal
		'b' => 1, # Bold
		'u' => 4, # Underline
		'f' => 5, # Flash
		'i' => 7, # Invert
		'h' => 8, # Hidden (invisible)
	];

	/**
	 *
	 */
	protected const COLORS = [
		'black'  => 0,
		'red'    => 1,
		'green'  => 2,
		'yellow' => 3,
		'navy'   => 4,
		'purple' => 5,
		'blue'   => 6,
		'white'  => 7,
	];

	/**
	 * AbstractConsoleApplication constructor.
	 * @throws Exception
	 */
	public function __construct() {
		$this->di = DI::getInstance();
		$this->parseParams();
	}

	/**
	 *
	 */
	public function run(): void {
		$cmd = $this->args[1];

		if(!$cmd) {
			$this->error('No command provided');
		} elseif(!method_exists($this, $cmd)) {
			$this->error("Unknown command: <b>{$cmd}</>");
		}

		try {
			$this->{$cmd}();
			exit;
		} catch (Throwable $e) {
			$this->error("{$cmd}: " . $e->getMessage(), $this->params['trace'] ? $e->getTrace() : $e->getTraceAsString());
		}

	}

	/**
	 * Parse command line params
	 */
	protected function parseParams(): void {
		foreach ($_SERVER['argv'] as $item) {
			if($item{0} === '-') {
				$item = ltrim($item, '-');
				[$param, $value] = explode('=', $item);
				if($value === null) $value = true;
				$this->params[$param] = $value;
			} else {
				$this->args[] = $item;
			}
		}
	}

	/**
	 * @param string $message
	 * @param bool $force
	 */
	protected function print(string $message, bool $force = false): void {
		if($this->params['silent'] && !$force) return;
		echo $this->colorize($message);
	}

	/**
	 * @param string $message
	 * @param bool $force
	 */
	protected function println(string $message, bool $force = false): void {
		$this->print($message . PHP_EOL, $force);
	}

	/**
	 * @param string $message
	 * @param null $context
	 * @param int $code
	 */
	protected function error(string $message, $context = null, $code = 1) {
		$this->println("<b><red>[ERROR] <n><red>{$message}</>", true);
		if($context) $this->println("<yellow>" . print_r($context, true) . "</>", true);
		exit($code);
	}

	/**
	 * Colorize Linux console output
	 *
	 * <ATTR> - sets attribute (n - Normal, b - Bold, u - Underline, f - Flash, i - Inverse, h - Hidden)
	 * <COLOR> - sets color (black, red, green, yellow, navy, purple, blue, white
	 * <bg:COLOR> - set background color
	 * </> - clear style
	 *
	 * @example <b><bg:yellow>Hello, <red>User</>
	 * @param string $message
	 * @return string
	 */
	protected function colorize(string $message): string {
		preg_match_all('/\<([a-z\:\/]+)\>/sU', $message, $m, PREG_SET_ORDER);
		foreach ($m as $cmd) {
			if(key_exists($cmd[1], self::COLORS)) $message = str_replace($cmd[0], "\x1b[" . (30 + self::COLORS[$cmd[1]]) . 'm', $message);
			elseif(substr($cmd[1], 0, 3) === 'bg:') {
				$cmd[1] = substr($cmd[1], 3);
				$message = str_replace($cmd[0], "\x1b[" . (40 + self::COLORS[$cmd[1]]) . 'm', $message);
			}
			elseif(key_exists($cmd[1], self::ATTRS))
				$message = str_replace($cmd[0], "\x1b[" . (self::ATTRS[$cmd[1]]) . 'm', $message);
			elseif($cmd[1] == '/') $message = str_replace($cmd[0], "\x1b[0m", $message);
		}
		return $message;
	}

}
