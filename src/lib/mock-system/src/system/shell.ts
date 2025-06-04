import type { Readable, Writable } from "node:stream";
import chalk from "chalk";
import stringWidth from "string-width";
import type { System } from "./system";

function parseCommand(input: string): { command: string; args: string[] } {
	const [command, ...args] = input.trim().split(" ");
	return { command, args };
}

export type ShellIO = {
	stdin: Readable;
	stdout: Writable;
	stderr: Writable;
};

export type ShellOptions = ShellIO & {
	system: System;
};

export class Shell {
	stdin: Readable;
	stdout: Writable;
	stderr: Writable;
	system: System;

	line = "";
	history: string[] = [];
	historyIndex = -1;
	cursor = 0;

	constructor({ stdin, stdout, stderr, system }: ShellOptions) {
		this.stdin = stdin;
		this.stdout = stdout;
		this.stderr = stderr;
		this.system = system;

		this.stdin.on("data", this.onInput.bind(this));
	}

	printPrompt() {
		this.stdout.write(this.prompt);
	}

	get prompt() {
		return `${chalk.blue(this.system.currentUser?.username)}@${this.system.hostname}:${chalk.magenta(this.system.cwd)} > `;
	}

	printMotd() {
		this.stdout.write(this.motd);
	}

	get motd() {
		return this.system.currentUser?.motd ?? "Use help to get started.";
	}

	resetLine() {
		this.line = "";
		this.cursor = 0;
	}

	onSigint() {
		this.resetLine();
		this.historyIndex = this.history.length;
		this.stdout.write("^C\r\n");
		this.printPrompt();
	}

	onEnter() {
		this.stdout.write("\r\n");

		this.history.push(this.line);
		this.historyIndex = this.history.length;

		const { command, args } = parseCommand(this.line);
		this.resetLine();
		this.system.executeCommand(command, args);
		this.printPrompt();
	}

	onDelete() {
		if (this.cursor < this.line.length) {
			this.line =
				this.line.slice(0, this.cursor) + this.line.slice(this.cursor + 1);
			this.refreshLine();
		}
	}

	onBackspace() {
		if (this.cursor > 0) {
			this.line =
				this.line.slice(0, this.cursor - 1) + this.line.slice(this.cursor);
			this.cursor--;
			this.refreshLine();
		}
	}

	onInput(data: Buffer) {
		const str = data.toString();

		if (data.readUInt8(0) === 0x03) return this.onSigint();
		if (data.readUInt8(0) === 0x0d) return this.onEnter();
		if (data.readUInt8(0) === 0x7f) return this.onBackspace();
		if (data.toString() === "\x1b\x5b\x33\x7e") return this.onDelete();

		if (
			data.readUInt8(0) === 0x1b &&
			data.byteLength >= 3 &&
			data.readUInt8(1) === 0x5b
		) {
			switch (data.readUInt8(2)) {
				case 0x41: // Up arrow
					this.historyIndex = Math.max(0, this.historyIndex - 1);
					this.line = this.history[this.historyIndex] ?? "";
					this.cursor = this.line.length;
					break;
				case 0x42: // Down arrow
					this.historyIndex = Math.min(
						this.history.length,
						this.historyIndex + 1,
					);
					this.line = this.history[this.historyIndex] ?? "";
					this.cursor = this.line.length;
					break;
				case 0x43: // Right arrow
					this.cursor = Math.min(this.line.length, this.cursor + 1);
					break;
				case 0x44: // Left arrow
					this.cursor = Math.max(0, this.cursor - 1);
					break;
				default:
					return;
			}

			this.refreshLine();
			return;
		}

		// Handle printable characters
		this.line =
			this.line.slice(0, this.cursor) + str + this.line.slice(this.cursor);
		this.cursor += str.length;

		this.refreshLine();
	}

	refreshLine() {
		this.stdout.write("\x1b[2K\r");
		this.stdout.write(this.prompt);
		this.stdout.write(this.line);
		this.stdout.write(`\x1b[${this.cursor + stringWidth(this.prompt) + 1}G`);
	}
}
