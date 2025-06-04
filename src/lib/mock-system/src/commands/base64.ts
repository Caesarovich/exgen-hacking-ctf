import { Command, type CommandParameters } from "../system/commands";
const name = "base64";

const description = "Encode or decode text to/from base64.";

const help = `
Encode or decode text to/from base64.

Usage:
	base64 <encode|decode> <text>

Example:

	base64 encode Hello, world!
	base64 decode SGVsbG8sIHdvcmxkIQ==
`;

function execute({ args, system }: CommandParameters) {
	if (args.length < 2) throw new Error("Usage: base64 <encode|decode> <text>");

	const [action, ...text] = args;

	if (action !== "encode" && action !== "decode")
		throw new Error(`Unknown action: ${action}`);

	const convertedText =
		action === "encode" ? btoa(text.join(" ")) : atob(text.join(" "));

	system.stdout.write(`${convertedText}\n`);
}

export default new Command({ name, description, help, handler: execute });
