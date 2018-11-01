<?php

namespace Controllers;

use Entities\Upload;
use Framework\Types\UUID;
use Framework\Validation\Validator;

class Uploads extends ApiController {

	/**
	 * @route /uploads/upload
	 */
	public function upload() {

		Validator::validateData((array)$this->params, [
			'name' => ['required' => true, 'type' => 'string', 'match' => '/\.(jpe?g|png|gif)$/'],
			'data' => ['required' => true, 'type' => 'string'],
		]);

		$id = UUID::generate();

		$d = '/uploads/' . substr($id, 0, 2);
		$n = $id . '_' . $this->params->name;

		$rd = __DIR__ . '/../../public' . $d;
		if(!is_dir($rd)) mkdir($rd, 0755, true);

		file_put_contents($rd . '/' . $n, base64_decode($this->params->data));

		$upload = new Upload;
		$upload->id = $id;
		$upload->name = $this->params->name;
		$upload->path = $d . '/' . $n;
		$upload->insert();

		return $upload->getData();

	}

}
