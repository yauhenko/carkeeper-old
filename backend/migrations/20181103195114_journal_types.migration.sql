CREATE TABLE `journal_types` (
  `id` int(10) UNSIGNED NOT NULL,
  `pid` int(10) UNSIGNED DEFAULT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `journal_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pid` (`pid`);

ALTER TABLE `journal_types`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `journal_types`
  ADD CONSTRAINT `journal_types_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `journal_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

DELETE FROM `journal`;

ALTER TABLE `journal`
  CHANGE `type` `type` INT UNSIGNED NOT NULL;

ALTER TABLE `journal`
  CHANGE `date` `date` DATE NOT NULL;

ALTER TABLE `journal`
  ADD FOREIGN KEY (`type`) REFERENCES `journal_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE `journal_types` ADD `order` INT UNSIGNED NULL DEFAULT NULL AFTER `pid`, ADD INDEX (`order`);

INSERT INTO `journal_types` (`id`, `pid`, `order`, `name`) VALUES ('1', NULL, 1000, 'Прочее');
