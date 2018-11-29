CREATE TABLE `maintenance_skel` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `distance` int(10) unsigned DEFAULT NULL,
  `period` int(10) unsigned DEFAULT NULL,
  `period_type` ENUM('month','year') NOT NULL DEFAULT 'year',
  `fuel` enum('gasoline','diesel') DEFAULT NULL,
  `transmission` enum('manual','automatic') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `maintenance` (
   `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
   `car` int(10) unsigned NOT NULL,
   `user` int(10) unsigned NOT NULL,
   `skel` int(10) unsigned DEFAULT NULL,
   `name` varchar(100) NOT NULL,
   `distance` int(10) unsigned DEFAULT NULL,
   `period` int(10) unsigned DEFAULT NULL,
   `period_type` ENUM('month','year') NOT NULL DEFAULT 'year',
   `last_odo` int(10) unsigned DEFAULT NULL,
   `last_date` date DEFAULT NULL,
   `next_odo` int(10) unsigned DEFAULT NULL,
   `next_date` date DEFAULT NULL,
   PRIMARY KEY (`id`),
   KEY `car` (`car`),
   KEY `user` (`user`),
   KEY `skel` (`skel`),
   CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`car`) REFERENCES `cars` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
   CONSTRAINT `maintenance_ibfk_2` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
   CONSTRAINT `maintenance_ibfk_3` FOREIGN KEY (`skel`) REFERENCES `maintenance_skel` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `journal` ADD `maintenance` INT UNSIGNED NULL DEFAULT NULL AFTER `odo`;
ALTER TABLE `journal` ADD FOREIGN KEY (`maintenance`) REFERENCES `maintenance`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `maintenance` ADD UNIQUE `unq` (`car`, `skel`);
