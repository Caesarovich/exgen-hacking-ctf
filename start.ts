#!/usr/bin/env bun

import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import config from "./drizzle.config";
import { networkInterfaces } from "node:os";
import { $ } from "bun";
import chalk from "chalk";

async function migrateDatabase() {
	try {
		const db = drizzle(Bun.env.DB_FILE_NAME);
		console.log(db);
		console.log(chalk.blue("Starting database migration..."));

		console.log(config);

		migrate(db, {
			migrationsFolder: config.out ?? "./drizzle",
		});

		console.log(chalk.green("Database migration completed successfully."));
	} catch (error) {
		console.error(chalk.red("Error during database migration:"), error);
		process.exit(1);
	}
}

async function main() {
	if (!Bun.env.SESSION_SECRET) {
		console.error(
			chalk.red("Error: SESSION_SECRET environment variable is not set."),
		);
		process.exit(1);
	}

	if (Bun.env.SESSION_SECRET.length < 32) {
		console.error(
			chalk.red("Error: SESSION_SECRET must be at least 32 characters long."),
		);
		process.exit(1);
	}

	if (!Bun.env.DB_FILE_NAME) {
		console.error(
			chalk.red("Error: DB_FILE_NAME environment variable is not set."),
		);
		process.exit(1);
	}

	if (!Bun.env.ADMIN_USERNAME) {
		console.error(
			chalk.red("Error: ADMIN_USERNAME environment variable is not set."),
		);
		process.exit(1);
	}

	if (!Bun.env.ADMIN_PASSWORD) {
		console.error(
			chalk.red("Error: ADMIN_PASSWORD environment variable is not set."),
		);
		process.exit(1);
	}

	console.log(chalk.green("Environment variables are set correctly."));

	await migrateDatabase();

	const port = Bun.env.PORT ?? 3000;

	console.log(chalk.blue("Starting the application..."));

	console.log(chalk.dim("----------------------------------------"));
	console.log(`Admin user: ${chalk.blueBright("admin")}`);
	console.log(`Admin password: ${chalk.blueBright(Bun.env.ADMIN_PASSWORD)}`);
	console.log(chalk.dim("----------------------------------------"));

	// Display network interfaces and their addresses
	for (const [name, info] of Object.entries(networkInterfaces())) {
		console.log(`Network interface: ${chalk.bold(name)}`);

		if (!info) continue;
		for (const { address, family } of info) {
			if (family === "IPv6") continue;
			console.log(chalk(`  ${family}: ${chalk.green(`${address}:${port}`)}`));
		}
	}

	console.log(chalk.dim("----------------------------------------"));

	await $`bun run start --port ${port} --color`;
}

main();
