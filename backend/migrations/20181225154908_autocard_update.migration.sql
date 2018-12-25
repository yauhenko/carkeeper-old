ALTER TABLE `autocard` ADD `middlename` VARCHAR(50) NOT NULL AFTER `firstname`;
ALTER TABLE `autocard` ADD `email` VARCHAR(50) NULL DEFAULT NULL AFTER `lastname`;
