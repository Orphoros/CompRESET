<script>
  import qs from "qs";
  import { onMount } from 'svelte';

  import Navbar from "../components/navbar.svelte";
   
  let httpCode = "404";
  let errorMessage = "The page you were looking for was not found!";


  onMount(() => {
		let searchParams = qs.parse(location.search.slice(1));
		if (Object.keys(searchParams).length === 0) return;
		if (searchParams.code) httpCode = searchParams.code;
		if (searchParams.message) errorMessage = searchParams.message;
	});
</script>

<svelte:head>
  <title>compReset</title>
</svelte:head>

<Navbar/>
<main>
  <p class="mt-20 ml-5 text-red-600 font-bold text-4xl text-center">Error</p>
  <p class="ml-5 text-red-600 text-xl italic text-center">{httpCode}</p>
  <p class="ml-5 text-center">{errorMessage}</p>
</main>