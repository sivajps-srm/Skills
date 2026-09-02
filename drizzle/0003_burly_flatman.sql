CREATE TABLE `journal_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`learner_name` text NOT NULL,
	`session_code` text NOT NULL,
	`topic` text NOT NULL,
	`entry` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `journal_learner_topic_unique` ON `journal_entries` (`learner_name`,`session_code`,`topic`);