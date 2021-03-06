<?php /** @noinspection ALL */

namespace Services;

use App\Stats;
use App\Tools;
use Collections\Cars;
use Collections\Fines;
use Collections\Users;
use DateTime;
use Entities\Car;
use Entities\Fine;
use Entities\User;
use Framework\DB\Client as DB;
use Framework\MQ\Task;
use Framework\Patterns\DI;
use Framework\Utils\Time;
use GuzzleHttp\Client as HttpClient;
use GuzzleHttp\Cookie\CookieJar;
use Tasks\Mail;
use Tasks\Push;
use Throwable;

class FinesService {

	protected $jar;

	public function check(int $limit = 10, callable $tick = null): void {
		return;
		Proxy::load(__DIR__ . '/../../data/proxy.txt');

		/** @var DB $db */
		$db = DI::getInstance()->db;

		$passList = $db->find('SELECT * FROM cars_pass WHERE udate IS NULL 
			OR TIMESTAMPDIFF(HOUR, udate, NOW()) >= 24 ORDER BY udate IS NULL DESC, udate ASC LIMIT ' . $limit);

		if(empty($passList)) return;

		foreach ($passList as $idx => $pass) {

			$proxy = Proxy::getRandomURL();

			print_r($pass);
			echo "Using proxy: {$proxy}\n";

			$http = new HttpClient;

			try {

				$res = $http->request('POST', 'http://mvd.gov.by/Ajax.asmx/GetExt', [
					'json' => [
						'GuidControl' => 2091,
						'Param1' => "{$pass['lastname']} {$pass['firstname']} {$pass['middlename']}",
						'Param2' => $pass['serie'],
						'Param3' => (string)$pass['number']
					],
					'proxy' => $proxy,
					'connect_timeout' => 5,
					'read_timeout' => 10,
					//'http_errors' => false
				]);
			} catch (Throwable $e) {
				echo $e->getMessage() . PHP_EOL;
				continue;
			}

			$data = (string)$res->getBody();
			print "Code: " . $res->getStatusCode() . PHP_EOL;
			//print $data;
			//$data = '"\u003ctable class=\"ii\" cellspacing=\"0\" cellpadding=\"2\" border=\"1\"\u003e\r\n  \u003ctr style=\"background-color: silver\"\u003e\r\n    \u003ctd\u003eФамилия, Имя, Отчество\u003c/td\u003e\r\n    \u003ctd\u003eСерия\u003c/td\u003e\r\n    \u003ctd\u003eСвид. о регистрации\u003c/td\u003e\r\n    \u003ctd\u003eДата и время правонарушения\u003c/td\u003e\r\n    \u003ctd\u003eРег. № правонарушения\u003c/td\u003e\r\n  \u003c/tr\u003e\r\n  \u003ctr\u003e\r\n    \u003ctd\u003eМОНИЧ АЛЕКСАНДР ИГОРЕВИЧ\u003c/td\u003e\r\n    \u003ctd\u003eOBA\u003c/td\u003e\r\n    \u003ctd\u003e177094\u003c/td\u003e\r\n    \u003ctd\u003e30.09.2018 8:51:00\u003c/td\u003e\r\n    \u003ctd\u003e18145999022\u003c/td\u003e\r\n  \u003c/tr\u003e\r\n  \u003ctr\u003e\r\n    \u003ctd\u003eМОНИЧ АЛЕКСАНДР ИГОРЕВИЧ\u003c/td\u003e\r\n    \u003ctd\u003eOBA\u003c/td\u003e\r\n    \u003ctd\u003e177094\u003c/td\u003e\r\n    \u003ctd\u003e23.09.2018 13:21:00\u003c/td\u003e\r\n    \u003ctd\u003e18146906169\u003c/td\u003e\r\n  \u003c/tr\u003e\r\n\u003c/table\u003e\r\n\u003cdiv\u003e\u003cb\u003eДата и время последнего обновления данных 29.10.2018 10:01:43.\u003c/b\u003e\u003c/div\u003e\r\n\u003cp\u003eШтраф за \r\nправонарушение можно оплатить в любом банке, подключенном к системе \"Расчет\" (ЕРИП). \r\nОплату можно совершить в платежно-справочном терминале, интернет-банкинге, \r\nбанкомате, кассе банка и других пунктах банковского обслуживания. Более подробная информация о перечне пунктов \r\nбанковского обслуживания, задействованных в системе \"Расчет\" (ЕРИП), размещена \r\nна сайте\r\n\u003ca target=\"_blank\" style=\"color: blue\" href=\"http://raschet.by/\"\u003e\r\nwww.raschet.by\u003c/a\u003e в разделе \"Плательщик\". В случае возникновения вопросов по \r\nсовершению оплаты обращайтесь к сотрудникам банка.\u003c/p\u003e\r\n\u003cp\u003eДля оплаты правонарушения Вам, либо сотруднику банка необходимо:\u003c/p\u003e\r\n\u003col\u003e\r\n  \u003cli\u003eВ системе \"Расчет\" (ЕРИП) последовательно перейти в разделы \"МВД\" - \"ГАИ - \r\nфотофиксация\", после чего выбрать услугу \"Скоростной режим\" (номер услуги 381141);\u003c/li\u003e\r\n  \u003cli\u003eВвести регистрационный номер правонарушения;\u003c/li\u003e\r\n  \u003cli\u003eСверить данные о правонарушении (фамилию, имя, отчество владельца транспортного средства \r\nи сумму штрафа);\u003c/li\u003e\r\n  \u003cli\u003eСовершить оплату.\u003c/li\u003e\r\n\u003c/ol\u003e"';

			$data = json_decode($data);

			if(!$data) {
				//echo 'Error!';
				continue;
			}

			/** @var Car $car */
			$car = Cars::factory()->get($pass['car']);

			if(preg_match('/По заданным критериям поиска информация не найдена/u', $data)) {
				$db->update('cars_fines', ['status' => 1], 'car', $car->id);
				goto finish;
			}

			preg_match_all('/<tr>.+<td>(.+)<\/td>.+<td>(.{3})<\/td>.+<td>([0-9]{6,7})<\/td>.+<td>([0-9\.\s\:]+)<\/td>.+<td>([0-9]+)<\/td>.+<\/tr>/isU', $data, $ms, PREG_SET_ORDER);

			$new = 0;
			$sum = 0;
			foreach ($ms as $m) {
				//print_r($m);
				$fines = new Fines;
				if(!$fine = $fines->findOneBy('regid', $m[5], true)) {
					$d = new DateTime($m[4]);
					$fine = new Fine;
					$fine->car = $car->id;
					$fine->user = $car->user;
					$fine->regid = (int)$m[5];
					$fine->cdate = Time::dateTime();
					$fine->rdate = $d->format('Y-m-d H:i:s');
					$fine->insert();

					$user = Users::factory()->get($car->user);
					Stats::roll((array)$user, ['fines' => 1]);

				}
				$det = $this->getFineDetails($fine);
				if($det['amount']) $sum += $det['amount'];
				if(!$fine->status) $new++;
				if($tick) $tick($idx);
			}

			$cnt = $db->findOne('SELECT COUNT(*) AS cnt FROM cars_fines WHERE car = {$car} AND status = 0', [
				'car' => $car->id
			])['cnt'];

			if($cnt > 0) {

				/** @var User $user */
				$user = Users::factory()->get($car->user);

				Task::create([Mail::class, 'sendTpl'], [
					'tpl' => 'mail/simple.twig',
					'to' => $user->email,
					'user' => $user,
					'subject' => $new ? 'Новый штраф!' : 'Любите быструю езду?',
					'html' => '<p>Извольте оплатить <b>' . $cnt . ' ' . Tools::plural($cnt, 'штраф,,а,ов') . '</b>' . ($sum ? ' на <b>' . $sum . ' руб</b>' : '') . '</p>',
				])->start();

				Task::create(Push::class, [
					'user' => $car->user,
					'title' => $new ? 'Новый штраф!' : 'Любите быструю езду?',
					'body' => 'Извольте оплатить ' . $cnt . ' ' . Tools::plural($cnt, 'штраф,,а,ов') . ($sum ? ' на ' . $sum . ' руб' : ''),
				])->start();

			}

			finish:
			$db->update('cars_pass', ['udate' => Time::dateTime()], 'car', $pass['car']);

			if($tick) {
				if(!$tick($idx))
					return;
			}
		}

	}

	public function getFineDetails(Fine $fine): ?array {

		$http = new HttpClient;

		if(!$jar = $this->jar) {

			$jar = $this->jar = new CookieJar;
			$res = $http->request('GET', 'http://wmtransfer.by/pay.asp', ['cookies' => $jar]);

			$data = (string)$res->getBody();
			preg_match_all('/<input type="hidden" name="([^"]+)" value="([^"]*)"\/>/isU', $data, $m);
			$form = array_combine($m[1], $m[2]);

			$http->request('POST', 'https://pay.wmtransfer.by/pls/iSOU/!iSOU.Authentication', [
				'cookies' => $jar,
				'form_params' => $form,
			]);

		}

		$res = $http->request('POST', 'https://pay.wmtransfer.by/pls/iSOU/!iSOU.PaymentPrepare', [
			'cookies' => $jar,
			'form_params' => [
				'service_no' => '391141',
				'ParamCount' => '',
				'Amount' => '',
				'AmountCurr' => '',
				'ServiceInfoId' => '',
				'ExtraInfoText' => '0B0C01C3C0C820F8F2F0E0F4',
			]
		]);

		$data = (string)$res->getBody();
		preg_match_all('/<input type="[a-z]+" name="([^"]+)" value="([^"]*)">/isU', $data, $m);
		$form = array_combine($m[1], $m[2]);
		$form['param2'] = $fine->regid;

		$res = $http->request('POST', 'https://pay.wmtransfer.by/pls/iSOU/!iSOU.PaymentPrepare', [
			'cookies' => $jar,
			'form_params' => $form
		]);

		$html = iconv('cp1251', 'utf-8', (string)$res->getBody());
		if(preg_match('/Запрашиваемая задолженность .+ не найдена/u', $html)) {
			$fine->status = 1;
			$fine->update();
			return ['status' => 'paid'];
		}

		preg_match('/NAME="Amount" SIZE="20" MAXLENGTH="15" VALUE="([^"]*)"/', (string)$res->getBody(), $amount);

		if($amount = str_replace(',', '.', $amount[1])) {
			$fine->status = 0;
			$fine->amount = (float)$amount;
			$fine->update();
			return [
				'status' => 'unpaid',
				'amount' => $amount
			];
		}

		return null;

	}

}
