<script lang="ts">
	import Logo from 'src/assets/logo.svelte';
	import TiArrowRightOutline from 'svelte-icons/ti/TiArrowRightOutline.svelte';

	var showLogo = false;
	setTimeout(() => {
		showLogo = true;
	}, 300);
</script>

<div class="wrapper">
	<Logo visible={showLogo} width="65%" />
	<button>
		play
		<div class="icon">
			<TiArrowRightOutline clas />
		</div>
	</button>
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

	button {
		font-size: 26pt;
	}
</style>
