import type { System } from "./system";
export type CommandParameters = {
	system: System;
	flags: Set<string>;
	args: string[];
};

export type CommandHandler = (params: CommandParameters) => void;

export interface ParsedArgs {
	flags: Set<string>;
	args: string[];
}

export function parseArgs(input: string[]): ParsedArgs {
	const flags = new Set<string>();
	const args: string[] = [];

	for (const item of input) {
		if (item.startsWith("-")) {
			for (let i = 1; i < item.length; i++) {
				flags.add(item[i]);
			}
		} else {
			args.push(item);
		}
	}

	return { flags, args };
}

type CommandOptions = {
	name: string;
	description: string;
	help: string;
	handler: CommandHandler;
};

export class Command {
	name: string;
	description: string;
	help: string;
	handler: CommandHandler;

	constructor({ name, description, help, handler }: CommandOptions) {
		this.name = name;
		this.description = description;
		this.help = help;
		this.handler = handler;
	}

	execute(params: CommandParameters) {
		const { args } = params;
		const parsedArgs = parseArgs(args);
		this.handler({ ...params, args: parsedArgs.args, flags: parsedArgs.flags });
	}
}
