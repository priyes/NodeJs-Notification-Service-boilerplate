CREATE TABLE `job_scheduler` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_name` varchar(255) NOT NULL,
  `pattern` varchar(255) DEFAULT NULL,
  `event_command` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `parameters` text NOT NULL,
  `description` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;


CREATE TABLE `event_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` char(36) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `event_type` varchar(255) DEFAULT NULL,
  `event_name` varchar(255) DEFAULT NULL,
  `event_details` text,
  `event_data` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `error_details` text,
  `is_success` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5552077 DEFAULT CHARSET=latin1;


INSERT INTO `job_scheduler` (`job_name`, `pattern`, `event_command`, `is_active`, `parameters`, `description`, `created_at`, `updated_at`) VALUES ('hello_world', '* * * * * *', 'hello_world_event', '1', '{}', 'Test', now(), now());

CREATE TABLE `notification_config` (
  `id` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `notification_name` varchar(255) NOT NULL,
  `notification_channel` varchar(255) NOT NULL,
  `desc` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


INSERT INTO `notification_config` (`id`, `notification_name`, `notification_channel`, `desc`, `created_at`, `updated_at`, `is_active`) VALUES (uuid(), 'USER_REGISTERED', 'EMAIL', 'Sends email to registred user', now(), now(), 1);



CREATE TABLE `user` (
  `id` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `name` varchar(80) NOT NULL,
  `email` varchar(80) NOT NULL,
  `dial_code` varchar(6) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `mobile_UNIQUE` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

