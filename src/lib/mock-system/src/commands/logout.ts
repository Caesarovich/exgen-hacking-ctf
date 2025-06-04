import { Command, type CommandParameters } from "../system/commands";

const name = "logout";

const description = "Log out of the system.";

const help = `
Log out of the system.

Usage:
	logout
`;

function execute({ system }: CommandParameters) {
	system.userSystem.logout();

	system.stdout.write("Logged out.\n");
}

export default new Command({ name, description, help, handler: execute });
