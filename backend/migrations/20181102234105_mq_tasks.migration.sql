CREATE TABLE `mq_tasks` (
  `id` int(10) UNSIGNED NOT NULL,
  `priority` tinyint(1) UNSIGNED NOT NULL DEFAULT '3',
  `class` varchar(100) NOT NULL,
  `method` varchar(100) NOT NULL,
  `trigger` varchar(100) DEFAULT NULL,
  `status` enum('new','wait','working','done','failed') NOT NULL DEFAULT 'new',
  `errors` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `data` mediumtext,
  `data_trigger` text,
  `result` mediumtext,
  `cdate` datetime NOT NULL,
  `mdate` datetime DEFAULT NULL,
  `sdate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `mq_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `main` (`status`,`trigger`,`sdate`,`priority`);

ALTER TABLE `mq_tasks` CHANGE `id` `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT;
