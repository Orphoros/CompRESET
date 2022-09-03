<script>
	export let heading;
	export let subHeading = "";
	export let styles = '';
</script>

<div class='bg-compResetThumbnailBG py-6 px-6 shadow-md w-full max-w-full {styles}'>
	<div class='space-y-1'>
		<h1 class='font-bold text-3xl text-center'>{heading}</h1>
		<h2 class='truncate {(subHeading === "") ? 'hidden' : ''} text-center'>{subHeading}</h2>
		<hr/>
	</div>
	<slot/>
</div>