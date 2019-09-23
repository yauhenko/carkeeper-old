<?php

namespace App;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;

/**
 * Class Twigext
 * @package App
 */
class Twigext extends AbstractExtension {

	/**
	 * @return array|TwigFilter[]
	 */
	public function getFilters() {
		return [
			new TwigFilter('t', 't'),
			new TwigFilter('bbcode', [$this, 'bbcode'], ['is_safe' => ['html']]),
			new TwigFilter('sign', [$this, 'sign']),
			new TwigFilter('dump', [$this, 'dump']),
			new TwigFilter('def', [$this, 'def'], ['is_safe' => ['html']]),
			new TwigFilter('hl', [$this, 'hl'], ['is_safe' => ['html']]),
			new TwigFilter('color', [$this, 'color'], ['is_safe' => ['html']]),
			new TwigFilter('contrast', [$this, 'contrast'], ['is_safe' => ['html']]),
			new TwigFilter('unhtml', [$this, 'unhtml']),
			new TwigFilter('truncate', [$this, 'truncate']),
			new TwigFilter('substr', 'mb_substr'),
		];
	}

	/**
	 * @return array|TwigFunction[]
	 */
	public function getFunctions() {
		return [
			new TwigFunction('icon',  [$this, 'icon'], ['is_safe' => ['html']]),
			new TwigFunction('params',  [$this, 'params'], ['is_safe' => ['html']]),
			new TwigFunction('trans', [$this, 'trans']),
			new TwigFunction('t', 't'),
			new TwigFunction('sort', [$this, 'html_sort'], ['is_safe' => ['html']]),
			new TwigFunction('perms', [$this, 'perms'], ['is_safe' => ['html']]),
			new TwigFunction('is_array', 'is_array'),
			new TwigFunction('date_diff', [$this, 'date_diff']),
			new TwigFunction('str_pad', 'str_pad'),
			new TwigFunction('str_repeat', 'str_repeat'),
			new TwigFunction('count', 'count'),
			new TwigFunction('implode', 'implode'),
			new TwigFunction('dataurl', [$this, 'dataurl']),
			new TwigFunction('cdn', [$this, 'cdn']),
			new TwigFunction('replaceUpload', [$this, 'replaceUpload']),
		];
	}

	/**
	 * @param $var
	 * @param string $stub
	 * @param string $before
	 * @param string $after
	 * @return string
	 */
	public function def($var, $stub = '', $before = '', $after = '') {
		$orig = $var;
		$var = preg_replace('/[^0-9]/', '', $var);
		if((int)$var == 0) return $stub;
		return $before . $orig . $after;
	}

	/**
	 * @param $var
	 * @return string
	 */
	public function hl($var) {
		$orig = $var;
		$var = (float)$var;
		if($var > 0) {
			return '<span style="color:green">+' . $orig . '</span>';
		} elseif($var < 0) {
			return '<span style="color:red">' . $orig . '</span>';
		} else {
			return $orig;
		}
	}

	/**
	 * @param string $name
	 * @param string $sort
	 * @param bool $default_order
	 * @param string $addParams
	 * @return string
	 */
	public function html_sort(string $name, string $sort, bool $default_order = false, string $addParams = '') {

		if(isset($_REQUEST['order']) && $_REQUEST['sort'] == $sort) {
			$order = (bool)$_REQUEST['order'];
			$new_order = !$order;
		} else {
			$order = $new_order = $default_order;
		}

		$html = '<a class="sort' . ($_REQUEST['sort'] == $sort ? ' sort-active' : '') . '" href="?sort=' . $sort . '&order=' . (int)$new_order;
		$html .= '&' . $this->params('*,!sort,!order' . ($addParams ? ',' . $addParams : ''));
		$html .= '">';
		$html .= $name . ' ';
		if($_REQUEST['sort'] == $sort) {
			$html .= $this->icon('sort-' . ($order ? 'asc' : 'desc'));
		} else {
			$html .= $this->icon('sort');
		}
		$html .= '</a>';
		return $html;
	}

	/**
	 * @param string $filter
	 * @return string
	 */
	public function params($filter = '*') {
		$result = $_REQUEST;
		if(!is_array($filter)) $filter = explode(',', $filter);
		$params = [];
		foreach($result as $key => $val) {
			if((in_array($key, $filter) || in_array('*', $filter) && !in_array('!' . $key, $filter))) {
				$params[$key] = $val;
			}
		}
		return http_build_query($params);
	}

	/**
	 * @param $str
	 * @param bool $fixed
	 * @return string
	 */
	public function icon($str, bool $fixed = false) {
		if($fixed) $str .= ' fas-fw';
		return '<i class="fas fa-' . $str . '"></i>';
	}


	/**
	 * @param $var
	 * @return mixed
	 */
	public function dump($var) {
		return print_r($var, true);
	}

	/**
	 * @param $str
	 * @return mixed
	 */
	public function bbcode($str) {
		//$str = str_replace(['[B]', '[/B]'], ['<b>', '</b>'], $str);
		return $str;
	}

	/**
	 * @param $data
	 * @return string
	 */
	public function color($data): string {
		$color = '#' . substr(md5($data), 0, 6);
		return $color;
	}

	/**
	 * @param string $color
	 * @return string
	 */
	public function contrast(string $color): string {
		$color = str_replace('#', '', $color);
		$r = hexdec(substr($color, 0, 2));
		$g = hexdec(substr($color, 2, 2));
		$b = hexdec(substr($color, 4, 2));
		$yiq = ($r * 299 + $g * 587 + $b * 114) / 1000;
		return ($yiq >= 128) ? 'black' : 'white';
	}

	/**
	 * @param $from
	 * @param $till
	 * @return false|int
	 */
	public function date_diff($from, $till) {
		return strtotime($from) - strtotime($till);
	}

	/**
	 * @param $html
	 * @return string
	 */
	public function unhtml($html): string {
		return html_entity_decode(strip_tags($html), ENT_QUOTES);
	}

	/**
	 * @param $text
	 * @param int $size
	 * @return string
	 */
	public function truncate($text, $size = 100): string {
		$text = $this->unhtml($text);
		if(mb_strlen($text) > $size) {
			$text = mb_substr($text, 0, $size, 'UTF-8') . '...';
		}
		return $text;
	}

//	public function dataurl($file) {
//		$data = base64_encode(file_get_contents(HOME . '/' . $file));
//		$type = mime_content_type(HOME . '/' . $file);
//		return 'data:' . $type . ';base64,' . $data;
//	}

//	public function cdn($file) {
//		return CDN . '/' . $file;
//	}

//	public function replaceUpload($uuid) {
//		return \Models\Uploads::getUrl(new \RS\Types\UUID($uuid))->asString();
//	}

}
