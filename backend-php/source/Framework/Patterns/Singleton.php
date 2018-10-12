<?php

namespace Framework\Patterns;

/**
 * Trait Singleton
 *
 * @package Framework\Patterns
 */
trait Singleton {

    /**
     * @var Singleton
     */
    protected static $instance;

    /**
     * Get Instance
     *
     * @return Singleton
     * @throws \Exception
     */
    public static function getInstance(): self {
        if(self::$instance) return self::$instance;
        return self::$instance = new self;
    }

    /**
     * Constructor
     *
     * @throws \Exception
     */
    public function __construct() {
        if(self::$instance) throw new \Exception('Instance already constructed. Use ' . self::class . '::getInstance()');
        self::$instance = $this;
    }

}
