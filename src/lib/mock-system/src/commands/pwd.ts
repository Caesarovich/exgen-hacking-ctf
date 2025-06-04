import { Command, type CommandParameters } from "../system/commands";

const name = "pwd";

const description = "Displays the current working directory.";

const help = `
Displays the current working directory.
`;

function execute({ system }: CommandParameters) {
	system.stdout.write(`${system.cwd}\n`);
}

export default new Command({ name, description, help, handler: execute });
