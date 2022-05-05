<script lang="ts">
	import Button from '$lib/Button/Button.svelte';
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Logo from './Logo.svelte';

	let show = true;
</script>

<!-- More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export -->
<!-- More on argTypes: https://storybook.js.org/docs/svelte/api/argtypes -->
<Meta title="Components/Logo" component={Logo} />

<!-- More on component templates: https://storybook.js.org/docs/svelte/writing-stories/introduction#using-args -->
<Template let:args>
	{#if show}
		<Logo {...args} on:click={() => {}} />
	{/if}
	<br />
	<Button
		on:click={() => {
			show = !show;
		}}>Show</Button
	>
</Template>

<!-- More on args: https://storybook.js.org/docs/svelte/writing-stories/args -->
<Story
	name="Primary"
	argTypes={{
		width: {
			control: { type: 'range', min: 200, max: 800, step: 2 }
		}
	}}
	args={{
		width: 500,
		animate: true,
		label: 'Logo'
	}}
/>
