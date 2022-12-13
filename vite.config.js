import preact from "@preact/preset-vite"

/** @type {import('vite').UserConfig} */
export default {
	plugins: [preact()],
	root: "src/client",
	build: {
		outDir: "../../dist",
		emptyOutDir: true,
	},
	server: {
		proxy: {
			"/socket.io": {
				target: "ws://127.0.0.1:8000",
				ws: true,
			},
		},
	},
}
