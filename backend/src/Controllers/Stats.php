<?php

namespace Controllers;

use Framework\Cache\CacheInterface;
use Framework\Types\UUID;
use Framework\Utils\Time;

/**
 * Class Stats
 *
 * @package Controllers
 */
class Stats extends ApiController {

	/**
	 * @route /stats/pixel
	 */
	public function pixel() {

		/** @var CacheInterface $ci */
		$ci = $this->di->get('cache:redis');

		$ip = $this->req->getClientIp();

		$uniq = false;

		if(!$ci->get("ip:{$ip}")) {
			$uniq = true;
			$ci->set("ip:{$ip}", time(), Time::DAY);
		}

		$this->params->date = Time::date();

		$ci->set("pixel:{$ip}", (array)$this->params, Time::DAY);

		\App\Stats::roll((array)$this->params, [
			'clicks' => 1,
			'uniqs' => (int)$uniq
		]);

		return true;

	}

	/**
	 * @route /stats/launch
	 */
	public function launch() {

		/** @var CacheInterface $ci */
		$ci = $this->di->get('cache:redis');

		$ip = $this->req->getClientIp();

		if(!$pixel = (array)json_decode(base64_decode($this->params->pixel)))
			$pixel = $ci->get("pixel:{$ip}");

		if($pixel) {
			\App\Stats::roll((array)$pixel, [
				'launches' => 1,
				'installs' => $this->params->first ? 1 : 0
			]);
			return ['pixel' => base64_encode(json_encode($pixel))];

		} else {
			return null;
		}
	}

}
