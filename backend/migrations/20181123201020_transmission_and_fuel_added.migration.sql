ALTER TABLE `cars` ADD `transmission` ENUM('manual','automatic') NULL DEFAULT NULL AFTER `odo_mdate`, ADD `fuel` ENUM('gasoline','diesel') NULL DEFAULT NULL AFTER `transmission`;
