import * as path from "node:path";
import { Command, type CommandParameters } from "../system/commands";

const name = "cat";

const description = "Displays a file to standard output.";

const help = `
Displays a file to standard output.

Usage:
	cat <file> [<file> ...]

Example:

	cat file.txt
	cat file1.txt file2.txt
`;

function execute({ system, args }: CommandParameters) {
	if (args.length === 0) {
		system.stderr.write("Usage: cat <file> [<file> ...]\n");
		return;
	}

	for (const file of args) {
		const filePath = path.isAbsolute(file) ? file : path.join(system.cwd, file);
		const content = system.fileSystem.readFile(filePath);
		system.stdout.write(`${content}\n`);
	}
}

export default new Command({ name, description, help, handler: execute });
