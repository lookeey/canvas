<script lang="ts">
	import Nav from 'src/components/Nav.svelte';
	import { resolvedTheme } from 'src/utils/theme';
	import 'canvas-uikit/globalCSS.svelte';
</script>

<div class="main {$resolvedTheme}">
	<Nav />
	<div id="content">
		<slot />
	</div>
</div>

<style lang="scss">
</style>
