import type { Command } from "./commands";
import type { System } from "./system";

import base64Command from "../commands/base64";
import catCommand from "../commands/cat";
import cdCommand from "../commands/cd";
import clearCommand from "../commands/clear";
import helpCommand from "../commands/help";
import login from "../commands/login";
import logout from "../commands/logout";
import lsCommand from "../commands/ls";
import pwd from "../commands/pwd";
import whoami from "../commands/whoami";

const commands: Command[] = [
	lsCommand,
	cdCommand,
	pwd,
	catCommand,
	clearCommand,
	helpCommand,
	logout,
	login,
	whoami,
	base64Command,
];

export class CommandRegistry {
	private commands: Map<string, Command>;

	constructor() {
		this.commands = new Map(commands.map((cmd) => [cmd.name, cmd]));
	}

	executeCommand({
		system,
		name,
		args,
	}: { system: System; name: string; args: string[] }) {
		this.getCommand(name).execute({ system, args, flags: new Set() });
	}

	getCommand(name: string): Command {
		const command = this.commands.get(name);

		if (!command) throw new Error(`Unknown command: ${name}`);

		return command;
	}

	getCommands(): Command[] {
		return Array.from(this.commands.values());
	}
}
