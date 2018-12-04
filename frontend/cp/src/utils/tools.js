export function range(n) {
	const arr = [];
	for(let i = 1; i <= n; i++) arr.push(i);
	return arr;
}

export function plural(val, str) {
	let  v = Math.abs(val) % 100, n = v % 10,
		p = (!n || n >= 5 || (v >= 5 && v <= 20)) ? 3 : ((n > 1 && n < 5) ? 2 : 1),
		s = str.split(',');
	return s[0] + s[p];
}

export function formToObject() {
	if (!(this instanceof formToObject)) {
		let test = new formToObject();
		return test.init.call(test, Array.prototype.slice.call(arguments));
	}

	/**
	 * Defaults
	 */
	let formRef = null;
	// Experimental. Don't rely on them yet.
	let settings = {
		includeEmptyValuedElements: false,
		w3cSuccessfulControlsOnly: false,
	};
	// Currently matching only '[]'.
	let keyRegex = /[^[]]+|\[\]/g;
	let $form = null;
	let $formElements;
	/**
	 * Private methods
	 */
	/**
	 * Check to see if the object is a HTML node.
	 *
	 * @param {HTMLFormElement} node
	 * @returns {boolean}
	 */
	function isDomElementNode(node) {
		return !!(node && typeof node === 'object' && 'nodeType' in node && node.nodeType === 1);
	}
	/**
	 * Check for last numeric key.
	 */
	function checkForLastNumericKey(o) {
		if (!o || typeof o !== 'object') {
			return;
		}

		return Object.keys(o).filter(function (elem) {
			return !isNaN(parseInt(elem, 10));
		}).splice(-1)[0];
	}
	/**
	 * Get last numeric key from an object.
	 * @param o object
	 * @return int
	 */
	function getLastIntegerKey(o) {
		let lastKeyIndex = checkForLastNumericKey(o);
		if (typeof lastKeyIndex === 'string') {
			return parseInt(lastKeyIndex, 10);
		} else {
			return 0;
		}
	}
	/**
	 * Get the next numeric key (like the index from a PHP array)
	 * @param o object
	 * @return int
	 */
	function getNextIntegerKey(o) {
		let lastKeyIndex = checkForLastNumericKey(o);
		if (typeof lastKeyIndex === 'string') {
			return parseInt(lastKeyIndex, 10) + 1;
		} else {
			return 0;
		}
	}
	/**
	 * Get the real number of properties from an object.
	 *
	 * @param {object} o
	 * @returns {number}
	 */
	function getObjLength(o) {
		if (typeof o !== 'object' || o === null) {
			return 0;
		}

		let l = 0;
		let k;
		if (typeof Object.keys === 'function') {
			l = Object.keys(o).length;
		} else {
			for (k in o) {
				if (o.hasOwnProperty(k)) {
					l++;
				}
			}
		}

		return l;
	}
	/**
	 * Simple extend of own properties.
	 * Needed for our settings.
	 *
	 * @param settings
	 * @param  {object} source The object with new properties that we want to add the the destination.
	 * @return {object}
	 */
	function extend(settings, source) {
		let i;
		for (i in source) {
			if (source.hasOwnProperty(i)) {
				settings[i] = source[i];
			}
		}

		return settings;
	}
	// Iteration through collections.
	// Compatible with IE.
	function forEach(arr, callback) {
		if ([].forEach) {
			return [].forEach.call(arr, callback);
		}

		let i;
		for (i = 0; i < arr.length; i++) {
			callback.call(arr, arr[i], i);
		}
	}
	// Constructor
	function init(options) {
		// Assign the current form reference.
		if (!options || typeof options !== 'object' || !options[0]) {
			return false;
		}
		// The form reference is always the first parameter of the method.
		// Eg: formToObject('myForm')
		formRef = options[0];
		// Override current settings.
		// Eg. formToObject('myForm', {mySetting: true})
		if (typeof options[1] !== 'undefined' && getObjLength(options[1]) > 0) {
			extend(settings, options[1]);
		}

		if (!setForm()) {
			return false;
		}

		if (!setFormElements()) {
			return false;
		}

		return convertToObj();
	}
	// Set the main form object we are working on.
	function setForm() {
		switch (typeof formRef) {
			case 'string':
				$form = document.getElementById(formRef);
				break;
			case 'object':
				if (isDomElementNode(formRef)) {
					$form = formRef;
				}
				break;
			default: break;
		}
		return $form;
	}

	function isUploadForm() {
		return $form.enctype && $form.enctype === 'multipart/form-data';
	}
	// Set the elements we need to parse.
	function setFormElements() {
		$formElements = $form.querySelectorAll('input, textarea, select');
		return $formElements.length;
	}

	function nodeHasSiblings($domNode) {
		let name = $domNode.name;
		return Array.prototype.filter.call($formElements, function (input) { return input.name === name; }).length > 1;
	}

	function isRadio($domNode) {
		return $domNode.nodeName === 'INPUT' && $domNode.type === 'radio';
	}

	function isCheckbox($domNode) {
		return $domNode.nodeName === 'INPUT' && $domNode.type === 'checkbox';
	}

	function isFileField($domNode) {
		return $domNode.nodeName === 'INPUT' && $domNode.type === 'file';
	}

	function isTextarea($domNode) {
		return $domNode.nodeName === 'TEXTAREA';
	}

	function isSelectSimple($domNode) {
		return $domNode.nodeName === 'SELECT' && $domNode.type === 'select-one';
	}

	function isSelectMultiple($domNode) {
		return $domNode.nodeName === 'SELECT' && $domNode.type === 'select-multiple';
	}

	function isSubmitButton($domNode) {
		return $domNode.nodeName === 'BUTTON' && $domNode.type === 'submit';
	}

	function isChecked($domNode) {
		return $domNode.checked;
	}
	//function isMultiple($domNode){
	//  return ($domNode.multiple ? true : false);
	//}
	function isFileList($domNode) {
		return (window.FileList && ($domNode.files instanceof window.FileList));
	}

	function getNodeValues($domNode) {
		// We're only interested in the radio that is checked.
		if (isRadio($domNode)) {
			return isChecked($domNode) ? $domNode.value : false;
		}
		// We're only interested in the checkbox that is checked.
		if (isCheckbox($domNode)) {
			return isChecked($domNode) ? $domNode.value : false;
		}
		// File inputs are a special case.
		// We have to grab the .files property of the input, which is a FileList.
		if (isFileField($domNode)) {
			// Ignore input file fields if the form is not encoded properly.
			if (isUploadForm()) {
				// HTML5 compatible browser.
				if (isFileList($domNode) && $domNode.files.length > 0) {
					return $domNode.files;
				} else {
					return ($domNode.value && $domNode.value !== '' ?
						$domNode.value :
						false);
				}
			} else {
				return false;
			}
		}
		// We're only interested in textarea fields that have values.
		if (isTextarea($domNode)) {
			return ($domNode.value && $domNode.value !== '' ?
				$domNode.value :
				false);
		}

		if (isSelectSimple($domNode)) {
			if ($domNode.value && $domNode.value !== '') {
				return $domNode.value;
			} else if ($domNode.options &&
				$domNode.options.length &&
				$domNode.options[0].value !== '') {
				return $domNode.options[0].value;
			} else {
				return false;
			}
		}
		// We're only interested in multiple selects that have at least one option selected.
		if (isSelectMultiple($domNode)) {
			if ($domNode.options && $domNode.options.length > 0) {
				let values = [];
				forEach($domNode.options, function ($option) {
					if ($option.selected) {
						values.push($option.value);
					}
				});

				if (settings.includeEmptyValuedElements) {
					return values;
				} else {
					return (values.length ? values : false);
				}
			} else {
				return false;
			}
		}
		// We're only interested if the button is type="submit"
		if (isSubmitButton($domNode)) {
			if ($domNode.value && $domNode.value !== '') {
				return $domNode.value;
			}

			if ($domNode.innerText && $domNode.innerText !== '') {
				return $domNode.innerText;
			}

			return false;
		}
		// Fallback or other non special fields.
		if (typeof $domNode.value !== 'undefined') {
			if (settings.includeEmptyValuedElements) {
				return $domNode.value;
			} else {
				return ($domNode.value !== '' ? $domNode.value : false);
			}
		} else {
			return false;
		}
	}

	function processSingleLevelNode($domNode, arr, domNodeValue, result) {
		// Get the last remaining key.
		let key = arr[0];
		// We're only interested in the radio that is checked.
		if (isRadio($domNode)) {
			if (domNodeValue !== false) {
				result[key] = domNodeValue;
				return domNodeValue;
			} else {
				return;
			}
		}
		// Checkboxes are a special case.
		// We have to grab each checked values
		// and put them into an array.
		if (isCheckbox($domNode)) {
			if (domNodeValue !== false) {
				if (nodeHasSiblings($domNode)) {
					if (!result[key]) {
						result[key] = [];
					}

					return result[key].push(domNodeValue);
				} else {
					result[key] = domNodeValue;
				}
			} else {
				return;
			}
		}
		// Multiple select is a special case.
		// We have to grab each selected option and put them into an array.
		if (isSelectMultiple($domNode)) {
			if (domNodeValue !== false) {
				result[key] = domNodeValue;
			} else {
				return;
			}
		}
		// Fallback or other cases that don't
		// need special treatment of the value.
		result[key] = domNodeValue;
		return domNodeValue;
	}

	function processMultiLevelNode($domNode, arr, value, result) {
		let keyName = arr[0];
		if (arr.length > 1) {
			if (keyName === '[]') {
				//result.push({});
				result[getNextIntegerKey(result)] = {};
				return processMultiLevelNode($domNode, arr.splice(1, arr.length), value, result[getLastIntegerKey(result)]);
			} else {
				if (result[keyName] && getObjLength(result[keyName]) > 0) {
					//result[keyName].push(null);
					return processMultiLevelNode($domNode, arr.splice(1, arr.length), value, result[keyName]);
				} else {
					result[keyName] = {};
				}

				return processMultiLevelNode($domNode, arr.splice(1, arr.length), value, result[keyName]);
			}
		}
		// Last key, attach the original value.
		if (arr.length === 1) {
			if (keyName === '[]') {
				//result.push(value);
				result[getNextIntegerKey(result)] = value;
				return result;
			} else {
				processSingleLevelNode($domNode, arr, value, result);
				//  result[keyName] = value;
				return result;
			}
		}
	}

	function convertToObj() {
		let i;
		let objKeyNames;
		let $domNode;
		let domNodeValue;
		let result = {};
		let resultLength;
		for (i = 0; i < $formElements.length; i++) {
			$domNode = $formElements[i];
			// Skip the element if the 'name' attribute is empty.
			// Skip the 'disabled' elements.
			// Skip the non selected radio elements.
			if (!$domNode.name ||
				$domNode.name === '' ||
				$domNode.disabled ||
				(isRadio($domNode) && !isChecked($domNode))) {
				continue;
			}
			// Get the final processed domNode value.
			domNodeValue = getNodeValues($domNode);
			// Exclude empty valued nodes if the settings allow it.
			if (domNodeValue === false && !settings.includeEmptyValuedElements) {
				continue;
			}
			// Extract all possible keys
			// Eg. name="firstName", name="settings[a][b]", name="settings[0][a]"
			objKeyNames = $domNode.name.match(keyRegex);
			if (objKeyNames.length === 1) {
				processSingleLevelNode($domNode, objKeyNames, (domNodeValue ? domNodeValue : ''), result);
			}

			if (objKeyNames.length > 1) {
				processMultiLevelNode($domNode, objKeyNames, (domNodeValue ? domNodeValue : ''), result);
			}
		}
		// Check the length of the result.
		resultLength = getObjLength(result);
		return resultLength > 0 ? result : false;
	}

	/**
	 * Expose public methods.
	 */
	return {
		init: init,
	};

}

