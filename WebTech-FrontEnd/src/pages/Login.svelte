<script>
	import { onMount } from 'svelte';
	import page from "page";
	import qs from "qs";
	import jwtDecode from "jwt-decode";
	import {loginUser} from "../helpers/apiLink";

	import NotificationLabel from "../components/notificationLabel.svelte";
	import ActionButton from "../components/actionButton.svelte";
	import TextInput from "../components/textInput.svelte";
	import Navbar from "../components/navbar.svelte";
	import Container from "../components/container.svelte";
	import tokenStore from "../stores/tokenStore";
	import userDataStore from "../stores/userDataStore";

	let searchParams;

	let stylesOfLoginButton = "";
	let clicked = false;
	let labelOfLoginButton = "Login Now";
	let labelOfRegisterButton = "Register";
	let messageBoxContent;
	let messageBoxType = "e";

	let email = "";
	let password = "";

	async function login(){
		if (clicked) return;

        clicked = true;
        stylesOfLoginButton = "processing";
		if (email === "" || password === ""){
			messageBoxContent = "Missing email or password";
			messageBoxType = "e";
			clicked = false;
			stylesOfLoginButton = "";
			return;
		}
		let loginData = {
			email: email,
			password: password
		};

		try {
			let response = await loginUser(loginData);
			let token = response.token;
			$tokenStore.token = token;
			$userDataStore.username = jwtDecode(token).username;
			$userDataStore.isAdmin = jwtDecode(token).isAdmin;
			page('/');
		} catch (e) {
			messageBoxContent = e.message;
			messageBoxType = "e";
			clicked = false;
			stylesOfLoginButton = "";
		}
    }

	function register(){
		page("/register");
    }

	const onEmailEnter = (e) => email = e.detail;

    const onPasswordEnter = (e) => password = e.detail;

	onMount(() => {
		searchParams = qs.parse(location.search.slice(1));
		if (Object.keys(searchParams).length === 0) return;
		if (searchParams.message) messageBoxContent = searchParams.message;
		if (searchParams.type) messageBoxType = searchParams.type;
	});
</script>

<svelte:head>
  <title>compReset - Login</title>
</svelte:head>

<Navbar styles='lg:absolute inset-x-0 top-0' tab='login'/>
<main>
	<section class="flex justify-center items-center lg:h-screen">
		<Container heading="Login" subHeading="Login to the system if you are registered" styles="mt-10 flex flex-col w- items-center w-96">
			<p class="mt-5">Email:</p>
			<TextInput instruction="Account email" on:textEntered={onEmailEnter}/>
			<p class="mt-5">Password:</p>
			<TextInput isPassword=true on:textEntered={onPasswordEnter} instruction="Account password"/> <br/>
			<section class="flex justify-center">
				<ActionButton label="{labelOfLoginButton}" styles="{stylesOfLoginButton} m-1" onClick={login}/>
				<ActionButton label="{labelOfRegisterButton}" styles="m-1" onClick={register}/>
			</section>
			{#if (messageBoxContent)}
				<NotificationLabel type={messageBoxType} message="{messageBoxContent}"/>
			{/if}
		</Container>
	</section>
</main>