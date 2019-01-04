<?php

namespace Controllers;

use Framework\Cache\CacheInterface;
use Framework\DB\Client;
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

		$this->params->source = $this->params->source ?: 'organic';
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
			$pixel = $ci->get("pixel:{$ip}") ?: [
				'date' => Time::date(),
				'source' => 'organic'
			];

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

	/**
	 * @route /stats
	 */
	public function stats() {
		$this->authAdmin();

		/** @var Client $db */
		$db = $this->di->db;

		$stats = $db->query('SELECT
			{&group} title,
			SUM(clicks) clicks,
			SUM(uniqs) uniqs,
			SUM(installs) installs,
			SUM(launches) launches,
			SUM(cars) cars,
			SUM(fines) fines,
			SUM(cards) cards
			FROM stats
			WHERE TRUE
			' . ($this->params->source ? ' AND source = {$source}' : '') . '
			' . ($this->params->date_from ? ' AND date >= {$date_from}' : '') . '
			' . ($this->params->date_till ? ' AND date <= {$date_till}' : '') . '
			GROUP BY {&group}
			ORDER BY {&sort} ' . ($this->params->order ? 'ASC' : 'DESC') . '
		', [
			'group' => $this->params->group ?: 'date',
			'sort' => $this->params->sort ?: true,
			'source' => $this->params->source ?: '',
			'date_from' => $this->params->date_from ?: '',
			'date_till' => $this->params->date_till ?: '',
		]);

		return $stats;

	}

	/**
	 * @route /stats/sources
	 */
	public function sources() {
		$this->authAdmin();
		/** @var Client $db */
		$db = $this->di->db;
		return $db->enum('SELECT DISTINCT source FROM stats WHERE source != "" ORDER BY source') ?: [];
	}

}
