/// <reference types="@sveltejs/kit" />

import 'svelte';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	// interface Locals {}
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}

declare module '*.svelte' {
	export { SvelteComponentDev as default } from 'svelte/internal';
}
