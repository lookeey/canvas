<script lang="ts">
	import FaRegMoon from 'svelte-icons/fa/FaRegMoon.svelte';
	import FaSun from 'svelte-icons/fa/FaSun.svelte';
	import FaAdjust from 'svelte-icons/fa/FaAdjust.svelte';

	import themeSetting from 'src/utils/theme';
	import web3 from 'src/utils/web3';
	import WalletModal from './WalletModal.svelte';

	let { connect } = web3;
	let { account } = $web3;
</script>

<nav>
	{#if $themeSetting === 'dark'}
		<button on:click={() => themeSetting.set('light')} title="Theme: Dark">
			<div class="icon">
				<FaRegMoon />
			</div>
		</button>
	{/if}
	{#if $themeSetting === 'light'}
		<button on:click={() => themeSetting.set('system')} title="Theme: Light">
			<div class="icon">
				<FaSun />
			</div>
		</button>
	{/if}
	{#if $themeSetting === 'system'}
		<button on:click={() => themeSetting.set('dark')} title="Theme: System">
			<div class="icon">
				<FaAdjust />
			</div>
		</button>
	{/if}

	<button class="connect" on:click={() => {}}> connect </button>
</nav>

<WalletModal />

<style lang="scss">
	nav {
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: space-around;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		height: 48px;
		width: 200px;
		background-color: var(--bg-color);

		button:not(.connect) {
			background-color: transparent;
			border: none;

			.icon {
				width: 24px;
				color: var(--primary);
			}
		}

		.connect {
			height: fit-content;
		}
	}
</style>
