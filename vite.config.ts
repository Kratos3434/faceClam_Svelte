import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
	],
	server: {
		proxy: {
			'/api': {
				target: 'https://lh1u4bi3l7.execute-api.ca-central-1.amazonaws.com/dev',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			},
		},
	},
});
