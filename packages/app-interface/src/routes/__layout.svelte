<script lang="ts">
	import Nav from 'src/components/Nav.svelte';
	import { resolvedTheme } from 'src/utils/theme';
</script>

<div class="main {$resolvedTheme}">
	<Nav />
	<div id="content">
		<slot />
	</div>
</div>

<style lang="scss">
	:global {
		// global vars
		.main {
			--display-font: Goldman;
		}

		// theme vars
		.main,
		.light {
			--bg-color: #f1f1f1;
			--primary: #464646;

			--blue-1: #0f45c0;
			--blue-2: #0a2e80;
			--blue-3: #061b4b;
		}

		.dark {
			--bg-color: #202020;
			--primary: #fff;

			--blue-1: #0f45c0;
			--blue-2: #3067e8;
			--blue-3: #588aff;
		}

		.main {
			width: 100%;
			height: 100%;
			position: fixed;
			background-color: var(--bg-color);
			color: var(--primary);
		}

		body {
			margin: 0;
			font-family: 'Saira Condensed', sans-serif;

			#content {
				padding-top: 48px;
			}
		}

		button {
			color: var(--bg-color);
			background-color: var(--primary);
			font-family: var(--display-font);
			border: none;
			border-radius: 3px;
			padding: 8px;
			font-size: 12pt;
		}
	}
</style>
