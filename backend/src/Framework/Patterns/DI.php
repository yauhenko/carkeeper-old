<?php

namespace Framework\Patterns;

use Exception;

/**
 * Class DI
 *
 * @package Framework\Patterns
 */
class DI {

    use Singleton;

    /**
     * Container
     *
     * @var array
     */
    protected $container = [];

    /**
     * Factories
     *
     * @var callable[]
     */
    protected $factories = [];

    /**
     * Put Service into container
     *
     * @param string $name
     * @param callable|mixed $factory
     * @return DI
     */
    public function set(string $name, $factory): self {
        if(is_callable($factory)) $this->factories[$name] = $factory;
        else $this->container[$name] = $factory;
        return $this;
    }

    /**
     * Get Service from container
     *
     * @param string $name
     * @return mixed
     * @throws Exception
     */
    public function get(string $name) {
        if($this->container[$name]) {
            return $this->container[$name];
        } elseif($this->factories[$name]) {
            return $this->container[$name] = $this->factories[$name]($this);
        } else {
            throw new Exception("Service '{$name}' is not registered");
        }
    }

    /**
     * Magic setter
     *
     * @param string $name
     * @param callable|mixed $factory
     */
    public function __set(string $name, $factory) {
        $this->set($name, $factory);
    }

    /**
     * Magic getter
     *
     * @param string $name
     * @return mixed
     * @throws Exception
     */
    public function __get(string $name) {
        return $this->get($name);
    }

}
