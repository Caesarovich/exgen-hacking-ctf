/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
export default defineConfig({
	plugins: [solidPlugin()],
	server: {
		port: 3000,
	},
	esbuild: {
		jsxInject: `import { h } from 'solid-js'`,
		jsxFactory: "h",
		jsxFragment: "Fragment",
	},
	build: {
		target: "esnext",
	},
	test: {
		environment: "jsdom",
		globals: true,
		testTransformMode: { web: ["/.[jt]sx?$/"] },
		deps: {
			inline: [/solid-js/],
		},
		setupFiles: ["./tests/setup.ts"],
	},
	resolve: {
		conditions: ["development", "browser"],
	},
});
