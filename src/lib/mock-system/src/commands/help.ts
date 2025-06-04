import chalk from "chalk";
import { Command, type CommandParameters } from "../system/commands";
import type { System } from "../system/system";

const name = "help";

const description = "Show available commands.";

const help = `
Show help for commands. If no command is specified, display a list of all available commands.

	help (command)

Example:

	help ls
	help
`;

function displayAllCommands(system: System) {
	system.stdout.write("Available commands:\n\n");

	for (const command of system.commands.getCommands()) {
		system.stdout.write(
			`  ${chalk.bold(command.name.padEnd(16))} ${chalk.grey(command.description)}\r\n`,
		);
	}

	system.stdout.write("\n");

	system.stdout.write(
		"For more information about a specific command, run `help [command]`\n",
	);
}

function displayCommandHelp(system: System, commandName: string) {
	const command = system.commands.getCommand(commandName);

	system.stdout.write(`${command.help}\n`);
}

function execute({ system, args }: CommandParameters) {
	const commandName = args.at(0);

	if (commandName) {
		displayCommandHelp(system, commandName);
	} else {
		displayAllCommands(system);
	}
}

export default new Command({ name, description, help, handler: execute });
