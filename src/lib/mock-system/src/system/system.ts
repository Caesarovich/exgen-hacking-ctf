import type { Readable, Writable } from "node:stream";
import chalk from "chalk";
import { CommandRegistry } from "./command-registry";
import FileSystem from "./files";
import { Shell, type ShellIO } from "./shell";
import UserSystem from "./users";

export class System {
	fileSystem = new FileSystem(this);
	userSystem = new UserSystem();
	commands = new CommandRegistry();

	shell: Shell;

	stdin: Readable;
	stdout: Writable;
	stderr: Writable;

	hostname = "mock";

	constructor(io: ShellIO) {
		this.shell = new Shell({ ...io, system: this });

		this.stdin = this.shell.stdin;
		this.stdout = this.shell.stdout;
		this.stderr = this.shell.stderr;
	}

	executeCommand(name: string, args: string[]) {
		if (!name) return;

		console.log("Executing command", name, args);

		try {
			this.commands.executeCommand({ system: this, name, args });
		} catch (error) {
			if (error instanceof Error) {
				this.shell.stderr.write(`${error.message}\r\n`);
			} else {
				this.shell.stderr.write("Unknown Error\r\n");
			}
		}
	}

	get currentUser() {
		return this.userSystem.currentUser;
	}

	get cwd() {
		return this.fileSystem.currentDirectory;
	}

	get prompt() {
		return `${chalk.blue(this.currentUser?.username)}@${this.hostname}:${chalk.magenta(this.cwd)} > `;
	}
}
