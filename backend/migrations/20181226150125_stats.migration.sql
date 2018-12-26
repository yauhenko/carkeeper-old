/* stats */

ALTER TABLE `users` ADD `date` DATE NULL DEFAULT NULL AFTER `fcm_auth`, ADD `source` VARCHAR(30) NULL DEFAULT NULL AFTER `date`;

CREATE TABLE `stats` (
  `date` date NOT NULL,
  `source` varchar(30) NOT NULL,
  `clicks` int(10) unsigned NOT NULL DEFAULT '0',
  `uniqs` int(10) unsigned NOT NULL DEFAULT '0',
  `installs` int(10) unsigned NOT NULL DEFAULT '0',
  `launches` int(10) unsigned NOT NULL DEFAULT '0',
  `cars` int(10) unsigned NOT NULL DEFAULT '0',
  `fines` int(10) unsigned NOT NULL DEFAULT '0',
  `cards` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`date`,`source`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
