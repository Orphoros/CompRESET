<script>
	import page from "page";
	import jwtDecode from "jwt-decode";
	import {logoutUser} from "../helpers/apiLink";

	import Link from './link.svelte';
	import SearchBar from './searchBar.svelte';
	import userDataStore from "../stores/userDataStore";
	import tokenStore from "../stores/tokenStore";

	export let tab = '';
	export let styles = '';
	export let onSearch = (e) => {
        if (e.detail === null || e.detail === "") page('/search');
		else page('/search?name='+e.detail);
	};

	let user = $userDataStore.username;
	let isAdmin = ($tokenStore.token && jwtDecode($tokenStore.token).isAdmin) ? true : false;

	async function logOut() {
		try {
			await logoutUser();
			$userDataStore.username = '';
			$tokenStore.token = '';
			page("/login?message=You have logged out!&type=i");
		}
		catch (e) {
			page('/login?message=A fatal error has occurred when trying to log out!&type=e');
		}
	}
</script>

<nav class='bg-compResetNavbar flex py-5 px-10 flex-col lg:justify-between lg:flex-row items-center w-full mx-auto z-50 {styles}'>
	<div class='bg-compResetButton rounded mb-5 lg:mb-0 px-4 py-1 flex h-full flex-col select-none'>
		<a href='/'>CompRESET</a>
	</div>
	<div class='mx-auto flex flex-col items-center lg:items-start lg:flex-row mb-5 lg:mb-0 {(tab === 'home') ? 'hidden' : ''}'>
		<SearchBar on:searchRequested={onSearch}/>
	</div>
	<div class='flex flex-col lm:flex-row items-center lg:items-end lg:flex-row lg:space-x-8'>
		<Link active={tab === 'admin'} href='/admin' hidden='{isAdmin ? '' : 'hidden'}'>Admin</Link>
		<Link active={tab === 'sell'} href='/sell' hidden={user === '' ? 'hidden' : ''}>Sell</Link>
		<Link active={tab === 'home'} href='/'>Home</Link>
		<Link active={tab === 'search'} href="/search"> Listings&#47;Search </Link>
		<Link active={tab === 'account'} href='/users/{user}' hidden={user === '' ? 'hidden' : ''}>User: {user}</Link>
		<Link active={tab === 'logout'} onClick={logOut}  hidden={user === '' ? 'hidden' : ''}>Logout</Link>
		<Link active={tab === 'login'} href='/login' hidden={user !== '' ? 'hidden' : ''}>Login</Link>
	</div>
</nav>