<?php

namespace Controllers;

use Entities\Upload;
use Framework\Types\UUID;

class Uploads extends ApiController {

	/**
	 * @route /uploads/upload
	 */
	public function upload() {

		if(!$this->params->name) throw new \Exception('Empty parameter: name', 40001);
		if(!$this->params->data) throw new \Exception('Empty parameter: data', 40002);

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
		$upload->save();

		return $upload->getData();

	}

}
