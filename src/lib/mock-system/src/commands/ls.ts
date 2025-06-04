import * as path from "node:path";
import { Command, type CommandParameters } from "../system/commands";

const name = "ls";

const description = "List the contents of a directory.";

const help = `
List information about FILES (the current directory by default).

Usage:
	ls [OPTION]... [FILE]...

Options:
	-a             abbreviation for 'all', shows all files including hidden files

Example:

	ls
	ls /home/user
	ls -a
`;

function execute({ system, args, flags }: CommandParameters) {
	const pathArg = args.at(0) ?? system.cwd;

	const specifiedDir = path.isAbsolute(pathArg)
		? pathArg
		: path.join(system.cwd, pathArg);

	const files = system.fileSystem.readDir(specifiedDir);

	for (const file of files) {
		if (!flags.has("a") && file.startsWith(".")) continue;

		system.stdout.write(`${file}\r\n`);
	}
}

export default new Command({ name, description, help, handler: execute });
