CREATE TABLE `triad_members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`triad_code` text NOT NULL,
	`learner_name` text NOT NULL,
	`role` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `triad_member_unique` ON `triad_members` (`triad_code`,`learner_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `triad_role_unique` ON `triad_members` (`triad_code`,`role`);--> statement-breakpoint
CREATE TABLE `triads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`created_by` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `triads_code_unique` ON `triads` (`code`);