CREATE TABLE `training_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`learner_code` text NOT NULL,
	`pulse_open` integer DEFAULT true NOT NULL,
	`workbook_open` integer DEFAULT true NOT NULL,
	`cards_open` integer DEFAULT true NOT NULL,
	`roleplay_open` integer DEFAULT true NOT NULL,
	`case_open` integer DEFAULT true NOT NULL,
	`finish_open` integer DEFAULT true NOT NULL,
	`debrief_response_id` integer,
	`debrief_visible` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `training_sessions_code_unique` ON `training_sessions` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `training_sessions_learner_code_unique` ON `training_sessions` (`learner_code`);--> statement-breakpoint
ALTER TABLE `triads` ADD `session_code` text DEFAULT 'WEDNESDAY-DEMO' NOT NULL;--> statement-breakpoint
ALTER TABLE `triads` ADD `round` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `triads` ADD `timer_remaining` integer DEFAULT 480 NOT NULL;--> statement-breakpoint
ALTER TABLE `triads` ADD `timer_ends_at` integer;--> statement-breakpoint
ALTER TABLE `triads` ADD `timer_running` integer DEFAULT false NOT NULL;