import { Command, type CommandParameters } from "../system/commands";

const name = "login";

const description = "Log in to the system.";

const help = `
Log in to the system.

Usage:
	login <username> <password>

Example:

	login john.doe password
`;

function execute({ system, args }: CommandParameters) {
	if (args.length !== 2) {
		system.stderr.write("Usage: login <username> <password>\n");
		return;
	}

	const [username, password] = args;

	if (system.currentUser?.username === username) {
		system.stderr.write(`Already logged in as ${username}.\n`);
		return;
	}

	const user = system.userSystem.login(username, password);

	if (!user) {
		system.stderr.write("Invalid username or password.\n");
		return;
	}

	system.fileSystem.currentDirectory = user.homeDirectory;
	system.shell.printMotd();
}

export default new Command({ name, description, help, handler: execute });
