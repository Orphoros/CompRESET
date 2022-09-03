<script>
import page from "page";

    import Navbar from "../components/navbar.svelte";
    import SearchBar from "../components/searchBar.svelte";
    import PageTitle from "../components/pageTitle.svelte";

    const onSearch = (e) => {
        if (e.detail === null || e.detail === "") page('/search');
		else page('/search?name='+e.detail);
	}
</script>

<svelte:head>
  <title>compReset</title>
</svelte:head>

<Navbar tab='home'/>

<main class="flex flex-col items-center">
 
    <PageTitle>Welcome to CompRESET</PageTitle>
    <h2 class="text-center mb-32"> And its absolutely dazzling home page </h2>
    <div class="scale-125">
        <SearchBar on:searchRequested={onSearch}/>
    </div>

</main>