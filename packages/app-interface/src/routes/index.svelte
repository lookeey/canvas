<script lang="ts">
	import Logo from 'src/assets/logo.svelte';
	import TiArrowRightOutline from 'svelte-icons/ti/TiArrowRightOutline.svelte';
	import { Button } from 'canvas-uikit';

	var showLogo = false;
	setTimeout(() => {
		showLogo = true;
	}, 300);
</script>

<div class="wrapper">
	<Logo visible={showLogo} width="65%" />
	<Button>
		play
		<div class="icon">
			<TiArrowRightOutline clas />
		</div>
	</Button>
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		margin: auto;
		width: 100%;
		height: 60vh;
		max-width: 1366px;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
	}
</style>
