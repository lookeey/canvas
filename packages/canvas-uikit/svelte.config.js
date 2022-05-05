import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(
    {
      scss: {
        includePaths: ['src'],
        loadPaths: ['src']
      }
    }
  ),

  kit: {
    adapter: adapter(),
    vite: {
      resolve: {
        alias: {
          '$lib': path.resolve('src/lib')
        }
      }
    }
  }

};

export default config;
