CREATE TABLE `players` (
	`id` text NOT NULL,
	`name` text NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`startedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`endedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `flag_submissions` (
	`flag` text NOT NULL,
	`submitterId` text NOT NULL,
	`points` integer NOT NULL,
	`submittedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	PRIMARY KEY(`flag`, `submitterId`),
	FOREIGN KEY (`submitterId`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE cascade
);
