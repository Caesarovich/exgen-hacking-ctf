#!/usr/bin/env bun

import { networkInterfaces } from "node:os";
import { $ } from "bun";
import chalk from "chalk";

const port = 3000;

console.log("Starting the application...");

console.log(chalk.dim("----------------------------------------"));
console.log(`Admin user: ${chalk.blueBright("admin")}`);
console.log(`Admin password: ${chalk.blueBright(Bun.env.ADMIN_PASSWORD)}`);
console.log(chalk.dim("----------------------------------------"));

for (const [name, info] of Object.entries(networkInterfaces())) {
	console.log(`Network interface: ${chalk.bold(name)}`);

	for (const { address, family } of info) {
		if (family === "IPv6") continue;
		console.log(chalk(`  ${family}: ${chalk.green(`${address}:${port}`)}`));
	}
}

console.log(chalk.dim("----------------------------------------"));

await $`bun run start --port ${port}`;
