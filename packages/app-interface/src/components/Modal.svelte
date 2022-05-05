<script lang="ts" context="module">
	import { Button } from 'canvas-uikit';
	let topModal: string | undefined;

	type Callback = (val: any) => any;
	type Modal = {
		open: (callback: any) => any;
		close: (returnValue: any) => any;
	};

	const modals: { [id: string]: Modal } = {};

	// 	returns an object for the modal specified by `id`, which contains the API functions (`open` and `close` )
	export function getModal(id = '') {
		return modals[id];
	}
</script>

<script lang="ts">
	import FaRegTimesCircle from 'svelte-icons/fa/FaRegTimesCircle.svelte';

	export let id = '';
	export let title = '';

	let onCloseCallback: Callback;
	let visible = false;
	let previousTopModal: string | undefined;

	function open(callback: Callback) {
		previousTopModal = topModal;
		topModal = id;
		visible = true;
		onCloseCallback = callback;
	}

	function close(returnValue: any) {
		visible = false;
		topModal = previousTopModal;
		if (onCloseCallback) onCloseCallback(returnValue);
		delete modals[id];
	}

	modals[id] = { open, close };
</script>

<div class="backdrop" class:visible>
	<div class="modal">
		<div class="header">
			<h3>{title}</h3>
			<Button>
				<FaRegTimesCircle />
			</Button>
		</div>
		<slot />
	</div>
</div>

<style lang="scss">
	.backdrop {
		display: none;
		justify-content: center;
		align-items: center;
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgba(0 0 0 / 0.1);

		&.visible {
			display: flex;
		}

		.modal {
			max-width: 400px;
			background-color: var(--bg-color);
			border: solid 2px var(--primary);
		}
	}
</style>
