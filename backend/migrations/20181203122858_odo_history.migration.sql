CREATE TABLE `odo_history` (
  `car` int(10) unsigned NOT NULL,
  `date` date NOT NULL,
  `odo` int(10) unsigned NOT NULL,
  PRIMARY KEY (`date`,`car`),
  KEY `car` (`car`),
  CONSTRAINT `odo_history_ibfk_1` FOREIGN KEY (`car`) REFERENCES `cars` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8
