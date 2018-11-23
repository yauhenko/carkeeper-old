<?php

namespace App;

/**
 * Tools
 */
class Tools {

	protected static $mime2ext = null;
	protected static $ext2mime = null;

	/**
	 * Parse string to float
	 * examples:
	 * 1,234.56 to 1234.56
	 * 1 200 300 to 1200300
	 * @param  mixed  $str Number
	 * @return float       Parsed float
	 */
	public static function toFloat($str) {
		return (float)str_replace([',', ' '], ['.', ''], $str);
	}

	/**
	 * Convert human date format to ISO
	 * example: 12.01.2015 to 2015-01-12
	 * @param  string $date Input date
	 * @return string       Converted date
	 */
	public static function h2date($date) {
		if(strpos($date, '-')) return $date;
		return implode('-', array_reverse(explode('.', $date)));
	}

	/**
	 * Linear interpolation
	 * @param  float|int $x  X
	 * @param  float|int $x1 X1
	 * @param  float|int $y1 Y1
	 * @param  float|int $x2 X2
	 * @param  float|int $y2 Y2
	 * @return float         Y
	 */
	public static function inter($x, $x1, $y1, $x2, $y2) {
		return (($y2 - $y1) / ($x2 - $x1)) * ($x - $x1) + $y1;
	}

	public static function enumArray(array $array, string $key = 'id') {
		$new = [];
		foreach($array as &$v) {
			$new[$v[$key]] = $v;
		}
		return $new;
	}

	public static function filterArray(array &$array, array $fields) {
		foreach($array as $k => $v) {
			if(!in_array($k, $fields)) unset($array[$k]);
		}
	}

	public static function groupFieldsArray(array &$array, array $fields) {
		foreach($array as &$item) {
			self::groupFields($item, $fields);
		}
	}

	public static function groupFields(array &$array, array $fields) {
		foreach($fields as $group) {
			foreach($array as $key => $val) {
				if(preg_match('/^' . $group . '_/', $key)) {
					$name = preg_replace('/^' . $group  . '_/', '', $key);
					if(!is_array($array[$group])) $array[$group] = [];
					$array[$group][$name] = $val;
					unset($array[$key]);
				}
			}
		}
	}
//
//	public static function mimeToExtenstion(string $mime, string $default = 'dat'): string {
//		if(!isset(self::$mime2ext)) self::$mime2ext = json_decode(file_get_contents(DAT_DIR . '/mime2ext.json'), true);
//		return self::$mime2ext[$mime] ?: $default;
//	}
//
//	public static function extenstionToMime(string $extension, string $default = 'application/octet-stream'): string {
//		if(!isset(self::$ext2mime)) self::$ext2mime = json_decode(file_get_contents(DAT_DIR . '/ext2mime.json'), true);
//		return self::$ext2mime[$extension] ?: $default;
//	}

	public static function zerofill(int $val, int $padding = 4): string {
		return sprintf("%0{$padding}d", $val);
	}
//
//	public static function plural(int $value, string $string): string {
//		$v = abs($value) % 100; $n = $v % 10;
//		$p = (!$n || $n >= 5 || ($v >= 5 && $v <= 20)) ? 3 : (($n > 1 && $n < 5) ? 2 : 1);
//		$s = explode(',', $string);
//		return $s[0] . $s[$p];
//	}

	public static function sex(string $str, string $sex = null): string {
		$str = explode(',', $str);
		if($sex === 'male') return (string)$str[0];
		elseif($sex === 'female') return (string)$str[1];
		else return (string)$str[2];
	}
//
//	public static function subQuery(array &$data, string $dataField, string $sql, string $dataId, string $subId, bool $single = false): void {
//		$ids = []; $idx = [];
//		foreach($data as $i => &$e) {
//			$ids[] = $e[$dataId];
//			$idx[$e[$dataId]][] = $i;
//			$e[$dataField] = $single ? null : [];
//		}
//		if(empty($ids)) return;
//		$subs = db()->query($sql, [$ids]);
//		foreach($subs as $sub) {
//			foreach ($idx[$sub[$subId]] as $index) {
//				if($single) {
//					$data[$index][$dataField] = $sub;
//				} else {
//					$data[$index][$dataField][] = $sub;
//				}
//			}
//		}
//	}

	public static function cast($val, string $type) {
		switch ($type) {
			case 'int':		return (int)$val;
			case 'string':	return (string)$val;
			case 'float':	return (float)$val;
			case 'array':	return (array)$val;
			case 'object':	return (object)$val;
			case 'bool':	return in_array((string)$val, ['1', 'true', 'on', 'yes']);
		}
		return $val;
	}

//	public static function smartReplace(array &$list, array $rules) {
//
//		foreach ($rules as $key => $rule) {
//			if(!$rule['key']) $rule['key'] = 'id';
//			if(!$rule['index']) $rule['index'] = $key;
//			$rules[$key] = $rule;
//		}
//
//		$index = $data = [];
//
//		array_walk_recursive($list, function($value, $key) use (&$rules, &$index) {
//			if($rules[$key]) {
//				$index[ $rules[$key]['index'] ][] = $value;
//			}
//		});
//
//		foreach ($index as $key => $ids) {
//			$index[$key] = array_unique($ids);
//		}
//
//		$cache = [];
//
//		foreach($rules as $key => $rule) {
//			if(!$r = $cache[ $rule['index'] ]) {
//				$r = Tools::enumArray(db()->query($rule['sql'], [$index[ $rule['index'] ]]), $rule['key']);
//				$cache[ $rule['index'] ] = $r;
//			}
//			$data[$key] = $r;
//		}
//
//		array_walk_recursive($list, function(&$value, $key) use (&$rules, &$index, &$data) {
//			if($rules[$key]) {
//				$value = $data[$key][$value] ?: null;
//			}
//		});
//	}

	public static function tel(?string $tel, int $code = 7): ?string {
		$tel = preg_replace('/[^0-9]/', '', $tel);
		$tel = preg_replace('/^80/', $code, $tel);
		$tel = preg_replace('/^8/', $code, $tel);
		return $tel ?: null;
	}

	public static function plural(int $n, string $source): string {
		$result = [];
		foreach (explode(' ', $source) as $text) {
			$text = explode(',', $text);
			$forms = [$text[1], $text[2], $text[3]];
			$result[] = $text[0] . ($n%10==1&&$n%100!=11?$forms[0]:($n%10>=2&&$n%10<=4&&($n%100<10||$n%100>=20)?$forms[1]:$forms[2]));
		}
		return implode(' ', $result);
	}

}
