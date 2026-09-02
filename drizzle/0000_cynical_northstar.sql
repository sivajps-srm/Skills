CREATE TABLE `activity_responses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`learner_name` text NOT NULL,
	`session_code` text DEFAULT 'WEDNESDAY-DEMO' NOT NULL,
	`activity` text NOT NULL,
	`response` text NOT NULL,
	`score` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
