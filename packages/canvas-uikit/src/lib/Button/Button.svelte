<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let variant: 'primary' | 'secondary' = 'primary';
	export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let disabled = false;

	export let style = '';

	const dispatch = createEventDispatcher();
	function onClick() {
		dispatch('click', event);
	}
</script>

<button {style} {disabled} on:click={onClick} class={`${variant} ${size}`}>
	<slot />
</button>

<style lang="scss">
	@use 'lib/vars' as *;

	button {
		font-family: $display-font;
		font-weight: 600;
		border: none;
		border-radius: 3px;
		padding: 8px;
		font-size: 12pt;
		transition: 200ms background-color;

		&.primary {
			background-color: $gray-3-light;
			color: $bg-color-light;

			&:hover {
				background-color: #{$gray-2-light};
			}

			&:active {
				background-color: #{$gray-1-light};
			}
		}

		&.secondary {
			background-color: $bg-color-light;
			color: $gray-2-light;
			box-shadow: inset 0 0 0 2px $gray-2-light;

			&:hover {
				background-color: #{$gray-2-light}44;
			}

			&:active {
				background-color: #{$gray-2-light}aa;
			}
		}
	}

	:global(.dark) {
		button {
			&.primary {
				color: $primary-light;
				background-color: $gray-3-dark;
				font-family: $display-font;

				&:hover {
					background-color: #{$gray-2-dark};
				}

				&:active {
					background-color: #{$gray-1-dark};
				}
			}

			&.secondary {
				background-color: $bg-color-dark;
				box-shadow: inset 0 0 0 2px $gray-2-dark;
				color: $gray-2-dark;
			}

			&:hover {
				background-color: #{$gray-2-dark}44;
			}

			&:active {
				background-color: #{$gray-2-dark}aa;
			}
		}
	}

	.sm {
		padding: 4px;
		font-size: 12px;
	}

	.md {
		padding: 8px;
		font-size: 12px;
	}

	.lg {
		padding: 10px;
		font-size: 16px;
	}

	.xl {
		padding: 12px;
		font-size: 24px;
	}
</style>
