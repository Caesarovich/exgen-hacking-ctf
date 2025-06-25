/// <reference types="@solidjs/start/env" />

declare module "bun" {
	interface Env {
		SESSION_SECRET: string;
		DB_FILE_NAME: string;
		ADMIN_USERNAME: string;
		ADMIN_PASSWORD: string;
	}
}

declare const umami: umami.umami;

/**
 * @see {@link https://umami.is/docs/tracker-functions|Umami Docs}
 */
declare namespace umami {
	interface umami {
		track(): Promise<string> | undefined;
		track(
			event_name: string,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			event_data?: { [key: string]: any },
		): Promise<string> | undefined;
		track(custom_payload: {
			website: string;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			[key: string]: any;
		}): Promise<string> | undefined;
		track(
			callback: (props: {
				hostname: string;
				language: string;
				referrer: string;
				screen: string;
				title: string;
				url: string;
				website: string;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			}) => { website: string; [key: string]: any },
		): Promise<string> | undefined;
	}
}
