import { defaultUsers } from "../default-data/users";

export interface User {
	username: string;
	password: string;
	groups?: string[];
	homeDirectory: string;
	motd: string;
}

class UserSystem {
	private users: User[];
	private loggedInUsers: User[];

	constructor() {
		this.users = structuredClone(defaultUsers);
		this.loggedInUsers = [];
	}

	login(username: string, password: string): User | null {
		const user = this.users.find(
			(u) => u.username === username && u.password === password,
		);
		if (user) {
			this.loggedInUsers.push(user);
			return user;
		}
		return null;
	}

	get currentUser(): User | null {
		return this.loggedInUsers.at(-1) || null;
	}

	logout() {
		if (this.loggedInUsers.length > 0) this.loggedInUsers.pop();
	}
}

export default UserSystem;
