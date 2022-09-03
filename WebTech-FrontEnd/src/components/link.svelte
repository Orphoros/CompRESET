<script>
	export let href = '';
	export let active = false;
	export let hidden = '';
	export let onClick;
</script>

<a href={active ? undefined : href} on:click={onClick} class='text-compResetText text-lg flex flex-col items-center {hidden}'>
	<slot />
	{#if active}
		<div class='bg-white h-1 w-20'></div>
	{/if}
</a>