/// <reference types="@solidjs/start/env" />

declare module "bun" {
	interface Env {
		SESSION_SECRET: string;
		DB_FILE_NAME: string;
		ADMIN_PASSWORD: string;
	}
}
