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
    .main {
      width: 100%;
      height: 100%;
      position: fixed;
    }

		body {
			margin: 0;
			font-family: 'Courier New', Courier, monospace;

			#content {
				padding-top: 48px;
			}
		}

		main,
		.light {
			--bg-color: #f1f1f1;
			--primary: #000;
		}

		.dark {
			--bg-color: #0f0f0f;
			--primary: #fff;
		}

		.main {
			background-color: var(--bg-color);
			color: var(--primary);
		}
	}
</style>
