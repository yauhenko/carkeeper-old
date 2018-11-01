ALTER TABLE `cars` ADD `odo` INT UNSIGNED NULL DEFAULT NULL AFTER `image`, ADD `odo_unit` ENUM('km','m') NOT NULL DEFAULT 'km' AFTER `odo`, ADD `odo_mdate` DATE NULL DEFAULT NULL AFTER `odo_unit`;
