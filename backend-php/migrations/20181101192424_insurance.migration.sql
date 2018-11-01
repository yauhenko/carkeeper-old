ALTER TABLE `cars_insurance` DROP `id`;
ALTER TABLE `cars_insurance` ADD PRIMARY KEY (`car`, `type`);
