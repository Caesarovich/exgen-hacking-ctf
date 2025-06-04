import path from "node:path";
import { Command, type CommandParameters } from "../system/commands";

const name = "cd";

const description = "Change directory.";

const help = `
Change the shell's working directory. You can use '..' to go up one directory.

Usage:
	cd <directory>

Example:

	cd /home/user
	cd ..
	cd Documents
`;

function execute({ system, args }: CommandParameters) {
	if (args.length !== 1) throw new Error("Usage: cd <directory>");

	const [dir] = args;
	const newPath = path.resolve(system.fileSystem.currentDirectory, dir);

	system.fileSystem.currentDirectory = newPath;
}

export default new Command({ name, description, help, handler: execute });
