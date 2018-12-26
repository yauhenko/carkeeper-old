/* fcm_auth */

ALTER TABLE `users` ADD `fcm_auth` TINYINT(1) UNSIGNED NOT NULL DEFAULT '1' AFTER `fcm`;
