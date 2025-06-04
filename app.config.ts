import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	appRoot: "src",
	vite: {
		plugins: [tailwindcss()],
	},
	server: {
		preset: "bun",
		experimental: {
			websocket: true,
		},
		publicAssets: [{ dir: "public", baseURL: "/" }],
		compatibilityDate: "2024-11-20",
	},
}).addRouter({
	name: "ws",
	type: "http",
	handler: "./src/lib/play-ws.ts",
	targert: "server",
	base: "/play/ws",
});
