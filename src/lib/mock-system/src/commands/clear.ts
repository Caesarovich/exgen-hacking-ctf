import { Command, type CommandParameters } from "../system/commands";

const name = "clear";

const description = "Clear the terminal screen.";

const help = `
Clear the terminal screen.

Usage:
	clear
`;

function execute({ system, args }: CommandParameters) {
	system.stdin.push("\x1B[2J\x1B[0;0H");
}

export default new Command({ name, description, help, handler: execute });
