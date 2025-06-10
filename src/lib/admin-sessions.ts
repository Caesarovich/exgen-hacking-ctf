import { redirect } from "@solidjs/router";
import { useSession } from "vinxi/http";

type AdminSession = {
	isAdmin: boolean;
};

export async function ensureAdminUser() {
	"use server";

	const session = await useSession<AdminSession>({
		password: Bun.env.SESSION_SECRET,
		cookie: {
			secure: false,
		},
	});

	if (!session?.data.isAdmin) throw redirect("/auth/login");

	return session.data;
}

export async function login(username: string, password: string) {
	"use server";
	const session = await useSession({
		password: Bun.env.SESSION_SECRET,
		cookie: {
			secure: false,
		},
	});

	if (
		username === Bun.env.ADMIN_USERNAME &&
		password === Bun.env.ADMIN_PASSWORD
	) {
		await session.update((data) => {
			data.isAdmin = true;
			return data;
		});
		throw redirect("/admin");
	}

	throw new Error("Invalid username or password");
}
