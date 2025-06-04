import chalk from "chalk";
import type { User } from "../system/users";

export const defaultUsers: User[] = [
	{
		username: "jamie",
		password: "password123",
		homeDirectory: "/home/jamie",
		motd: "Welcome Jamie! \n\nYou have successfully logged in to the ExGen main server. \n\nUse the 'help' command to get started.\n",
	},

	{
		username: "marcus",
		password: "Ev3rgr33n",
		homeDirectory: "/home/marcus",
		motd: "Welcome Marcus! \n\nThere have been (23) new activities in the logs. \n\nUse the 'help' command to get started.\n",
	},
	{
		username: "evelyn",
		password: "P3anuts_2024",
		homeDirectory: "/home/evelyn",
		motd: `Welcome Dr. Evelyn Carter! \n\nProject Overwatch status: ${chalk.green("OK")} \n\nUse the 'help' command to get started.\n`,
	},
];
