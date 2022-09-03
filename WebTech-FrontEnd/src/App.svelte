<script>
    import router from "page";
    import qs from "qs";
    import isAuthenticated from "./middleware/isAuthenticated";
    import isAdmin from "./middleware/isAdmin";

    import Index from "./pages/Index.svelte";
    import Login from "./pages/Login.svelte";
    import Listing from "./pages/Listing.svelte";
    import Register from "./pages/Register.svelte";
    import Search from "./pages/Search.svelte";
    import User from "./pages/UserProfile.svelte";
    import Admin from "./pages/Admin.svelte";
    import Sell from "./pages/Sell.svelte";
    import ErrorPage from "./pages/ErrorPage.svelte";

    let page, params;

    router('/', () => page = Index);
    router('/login', () => page = Login);
    router('/register', () => page = Register);
    router('/search', () => page = Search);
    router('/error', () => page = ErrorPage);
    router('/sell', isAuthenticated, () => page = Sell);
    router('/admin', isAdmin, () => page = Admin);
    router('/listings/:id', (ctx) => {
        params = ctx.params;
        page = Listing
    });
    router('/users/:username', (ctx) => {
        params = ctx.params;
        page = User
    });
    

    router.start();


</script>

<svelte:head>
  <title>compReset</title>
</svelte:head>

{#if page === undefined}
    <svelte:component this="{ErrorPage}"/>
{:else}
    <svelte:component this="{page}" {params}/>
{/if}

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @layer utilities{
        .border-spacing{
            border-collapse: separate;
            border-spacing: 0.25rem;
        }
    }
    body {
        padding: 0;
        @apply text-compResetText
        bg-compResetBackground;
    }
    a {
        @apply visited:text-compResetText
    }
</style>