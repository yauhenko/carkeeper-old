CREATE TABLE `cars_fines` (
  `id` int(10) UNSIGNED NOT NULL,
  `car` int(10) UNSIGNED NOT NULL,
  `user` int(10) UNSIGNED NOT NULL,
  `regid` int(10) UNSIGNED NOT NULL,
  `cdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rdate` datetime NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `cars_fines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car` (`car`),
  ADD KEY `user` (`user`);

ALTER TABLE `cars_fines`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `cars_fines`
  ADD CONSTRAINT `cars_fines_ibfk_1` FOREIGN KEY (`car`) REFERENCES `cars` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cars_fines_ibfk_2` FOREIGN KEY (`user`) REFERENCES `users` (`id`);

