import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import path from 'path';

const production = process.env.NODE_ENV === 'production';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		vite: {
      resolve: {
        alias: {
          src: path.resolve('./src')
        }
      },

			plugins: [
				!production && nodePolyfills({
						include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')]
					})
			],
	
			build: {
				rollupOptions: {
					plugins: [
						nodePolyfills()
					]
				},
				commonjsOptions: {
					transformMixedEsModules: true
				}
			}
    },
	}
};

export default config;
