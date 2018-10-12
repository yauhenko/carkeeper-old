<?php

namespace App;

use Twig_Extension;
use Twig_Filter;
use Twig_Function;

class Twigext extends Twig_Extension {

	public function getFilters() {
		return [
			new Twig_Filter('t', 't'),
			new Twig_Filter('bbcode', [$this, 'bbcode'], ['is_safe' => ['html']]),
			new Twig_Filter('sign', [$this, 'sign']),
			new Twig_Filter('dump', [$this, 'dump']),
			new Twig_Filter('def', [$this, 'def'], ['is_safe' => ['html']]),
			new Twig_Filter('hl', [$this, 'hl'], ['is_safe' => ['html']]),
			new Twig_Filter('color', [$this, 'color'], ['is_safe' => ['html']]),
			new Twig_Filter('contrast', [$this, 'contrast'], ['is_safe' => ['html']]),
			new Twig_Filter('unhtml', [$this, 'unhtml']),
			new Twig_Filter('truncate', [$this, 'truncate']),
			new Twig_Filter('substr', 'mb_substr'),
		];
	}

	public function getFunctions() {
		return [
			new Twig_Function('icon',  [$this, 'icon'], ['is_safe' => ['html']]),
			new Twig_Function('params',  [$this, 'params'], ['is_safe' => ['html']]),
			new Twig_Function('trans', [$this, 'trans']),
			new Twig_Function('t', 't'),
			new Twig_Function('sort', [$this, 'html_sort'], ['is_safe' => ['html']]),
			new Twig_Function('perms', [$this, 'perms'], ['is_safe' => ['html']]),
			new Twig_Function('is_array', 'is_array'),
			new Twig_Function('date_diff', [$this, 'date_diff']),
			new Twig_Function('str_pad', 'str_pad'),
			new Twig_Function('str_repeat', 'str_repeat'),
			new Twig_Function('count', 'count'),
			new Twig_Function('implode', 'implode'),
			new Twig_Function('dataurl', [$this, 'dataurl']),
			new Twig_Function('cdn', [$this, 'cdn']),
			new Twig_Function('replaceUpload', [$this, 'replaceUpload']),
		];
	}

	public function def($var, $stub = '', $before = '', $after = '') {
		$orig = $var;
		$var = preg_replace('/[^0-9]/', '', $var);
		if((int)$var == 0) return $stub;
		return $before . $orig . $after;
	}

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

	public function icon($str, bool $fixed = false) {
		if($fixed) $str .= ' fas-fw';
		return '<i class="fas fa-' . $str . '"></i>';
	}


	public function dump($var) {
		return print_r($var, true);
	}

	public function bbcode($str) {
		//$str = str_replace(['[B]', '[/B]'], ['<b>', '</b>'], $str);
		return $str;
	}

	public function color($data): string {
		$color = '#' . substr(md5($data), 0, 6);
		return $color;
	}

	public function contrast(string $color): string {
		$color = str_replace('#', '', $color);
		$r = hexdec(substr($color, 0, 2));
		$g = hexdec(substr($color, 2, 2));
		$b = hexdec(substr($color, 4, 2));
		$yiq = ($r * 299 + $g * 587 + $b * 114) / 1000;
		return ($yiq >= 128) ? 'black' : 'white';
	}

	public function date_diff($from, $till) {
		return strtotime($from) - strtotime($till);
	}

	public function unhtml($html): string {
		return html_entity_decode(strip_tags($html), ENT_QUOTES);
	}

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
