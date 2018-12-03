CREATE TABLE `fuel_history` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `car` int(10) unsigned NOT NULL,
  `date` date NOT NULL,
  `odo` int(10) unsigned NOT NULL,
  `amount` int(10) unsigned NOT NULL,
  `price` float(10,2) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `car` (`car`),
  CONSTRAINT `fuel_history_ibfk_1` FOREIGN KEY (`car`) REFERENCES `cars` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8
