<script lang="ts">
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Button from './Button.svelte';
</script>

<!-- More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export -->
<!-- More on argTypes: https://storybook.js.org/docs/svelte/api/argtypes -->
<Meta title="Components/Button" component={Button} />

<!-- More on component templates: https://storybook.js.org/docs/svelte/writing-stories/introduction#using-args -->
<Template let:args>
	<Button {...args} on:click={() => {}}>{args.label}</Button>
</Template>

<!-- More on args: https://storybook.js.org/docs/svelte/writing-stories/args -->
<Story
	name="Primary"
	argTypes={{
		size: {
			options: ['sm', 'md', 'lg', 'xl'],
			control: { type: 'radio' }
		},
		variant: {
			options: ['primary', 'secondary'],
			control: { type: 'radio' }
		}
	}}
	args={{
		variant: 'primary',
		label: 'Button'
	}}
/>
