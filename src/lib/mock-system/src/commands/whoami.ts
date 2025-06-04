import { Command, type CommandParameters } from "../system/commands";

const name = "whoami";

const description = "Display the current user.";

const help = `
Display the current user.

Usage:
	whoami
`;

function execute({ system }: CommandParameters) {
	const user = system.currentUser;

	if (!user) throw new Error("Not logged in\n");

	system.stdout.write(`${user.username}\n`);
}

export default new Command({ name, description, help, handler: execute });
