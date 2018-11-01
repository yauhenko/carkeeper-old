<?php

namespace Framework\Types;

use Exception;

class File {

    protected $filename;

    public function __construct(string $filename) {
        $this->filename = realpath($filename);
        if(!file_exists($this->filename)) {
            throw new Exception('File does not exists: ' . $filename);
        }
    }

    public static function create(string $filename, ?string $data = null, bool $force = false): ?self {
        $filename = realpath($filename);
        if(!$force && file_exists($filename)) throw new Exception('File already exists: ' . $filename);
        if(file_put_contents($filename, $data) !== false) {
            return new self($filename);
        }
        throw new Exception('Failed to create file: ' . $filename);
    }

    public function getName(): string {
        return $this->filename;
    }

    public function getSize(): int {
        return filesize($this->filename);
    }

    public function getType(): string {
        return mime_content_type($this->filename);
    }

    public function getExtension(): string {
        return pathinfo($this->filename, PATHINFO_EXTENSION);
    }

    public function getDirName(): string {
        return pathinfo($this->filename, PATHINFO_DIRNAME);
    }

    public function getFileName(): string {
        return pathinfo($this->filename, PATHINFO_BASENAME);
    }

    public function rename(string $filename): bool {
        if(rename($this->filename, $filename)) {
            $this->filename = $filename;
            return true;
        }
        return false;
    }

    public function chmod(int $mode): bool {
        return chmod($this->filename, $mode);
    }

    public function copy(string $newFilename): bool {
        return copy($this->filename, $newFilename);
    }

    public function delete(): bool {
        return unlink($this->filename);
    }

    public function write($data): bool {
        return file_put_contents($this->filename, $data) == false ? false : true;
    }

    public function read(): string {
        return file_get_contents($this->filename);
    }

}
