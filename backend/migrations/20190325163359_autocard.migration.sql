ALTER TABLE `autocard` CHANGE `user` `user` INT(10) UNSIGNED NULL DEFAULT NULL;
ALTER TABLE `autocard` DROP INDEX `tel`, ADD UNIQUE `tel` (`tel`, `cid`) USING BTREE;
