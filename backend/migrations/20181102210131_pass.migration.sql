CREATE TABLE `cars_pass` (
  `car` int(10) UNSIGNED NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `middlename` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `serie` char(3) NOT NULL,
  `number` mediumint(6) NOT NULL,
  `udate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `cars_pass`
  ADD PRIMARY KEY (`car`);

ALTER TABLE `cars_pass`
  ADD CONSTRAINT `cars_pass_ibfk_1` FOREIGN KEY (`car`) REFERENCES `cars` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
