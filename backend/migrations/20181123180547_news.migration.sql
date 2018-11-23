CREATE TABLE `news` (
  `id` int(10) UNSIGNED NOT NULL,
  `channel` int(10) UNSIGNED NOT NULL,
  `title` varchar(150) NOT NULL,
  `content` json NOT NULL,
  `image` char(36) DEFAULT NULL,
  `date_begin` date DEFAULT NULL,
  `date_end` date DEFAULT NULL,
  `pinned` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `published` tinyint(1) UNSIGNED NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `news_channels` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD KEY `channel` (`channel`),
  ADD KEY `image` (`image`);

ALTER TABLE `news_channels`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `news`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `news_channels`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `news`
  ADD CONSTRAINT `news_ibfk_1` FOREIGN KEY (`channel`) REFERENCES `news_channels` (`id`),
  ADD CONSTRAINT `news_ibfk_2` FOREIGN KEY (`image`) REFERENCES `uploads` (`id`);
