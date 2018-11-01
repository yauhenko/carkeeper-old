SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `cars` (
  `id` int(10) UNSIGNED NOT NULL,
  `user` int(10) UNSIGNED NOT NULL,
  `mark` int(10) UNSIGNED NOT NULL,
  `model` int(10) UNSIGNED NOT NULL,
  `year` smallint(4) UNSIGNED NOT NULL,
  `generation` int(10) UNSIGNED DEFAULT NULL,
  `serie` int(10) UNSIGNED DEFAULT NULL,
  `modification` int(10) UNSIGNED DEFAULT NULL,
  `image` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `cars_checkup` (
  `car` int(10) UNSIGNED NOT NULL,
  `notify` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `edate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `cars_insurance` (
  `id` int(10) UNSIGNED NOT NULL,
  `car` int(10) UNSIGNED NOT NULL,
  `notify` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  `edate` date DEFAULT NULL,
  `type` enum('regular','casco') NOT NULL DEFAULT 'regular'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `sessions` (
  `token` char(64) NOT NULL,
  `user` int(10) UNSIGNED NOT NULL,
  `edate` datetime DEFAULT NULL,
  `ip` varchar(39) DEFAULT NULL,
  `ttl` mediumint(8) UNSIGNED NOT NULL DEFAULT '3600'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `uploads` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `path` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `active` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  `tel` bigint(14) UNSIGNED NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `avatar` char(36) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `username` varchar(20) DEFAULT NULL,
  `city` smallint(5) UNSIGNED DEFAULT NULL,
  `fcm` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`),
  ADD KEY `mark` (`mark`),
  ADD KEY `model` (`model`),
  ADD KEY `generation` (`generation`),
  ADD KEY `serie` (`serie`),
  ADD KEY `modification` (`modification`),
  ADD KEY `image` (`image`);

ALTER TABLE `cars_checkup`
  ADD PRIMARY KEY (`car`);

ALTER TABLE `cars_insurance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car` (`car`);

ALTER TABLE `sessions`
  ADD PRIMARY KEY (`token`),
  ADD KEY `user` (`user`),
  ADD KEY `edate` (`edate`);

ALTER TABLE `uploads`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`tel`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `avatar` (`avatar`),
  ADD KEY `city` (`city`);


ALTER TABLE `cars`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `cars_insurance`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;


ALTER TABLE `cars`
  ADD CONSTRAINT `cars_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cars_ibfk_2` FOREIGN KEY (`mark`) REFERENCES `car_mark` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `cars_ibfk_3` FOREIGN KEY (`model`) REFERENCES `car_model` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `cars_ibfk_4` FOREIGN KEY (`generation`) REFERENCES `car_generation` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `cars_ibfk_5` FOREIGN KEY (`serie`) REFERENCES `car_serie` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `cars_ibfk_6` FOREIGN KEY (`modification`) REFERENCES `car_modification` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `cars_ibfk_7` FOREIGN KEY (`image`) REFERENCES `uploads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `cars_checkup`
  ADD CONSTRAINT `cars_checkup_ibfk_1` FOREIGN KEY (`car`) REFERENCES `cars` (`id`) ON DELETE CASCADE;

ALTER TABLE `cars_insurance`
  ADD CONSTRAINT `cars_insurance_ibfk_1` FOREIGN KEY (`car`) REFERENCES `cars` (`id`) ON DELETE CASCADE;

ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`avatar`) REFERENCES `uploads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`city`) REFERENCES `geo_cities` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
