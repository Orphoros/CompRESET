<script>
	import {registerNewUser} from "../helpers/apiLink";
	import ActionButton from "../components/actionButton.svelte";
	import TextInput from "../components/textInput.svelte";
	import Container from "../components/container.svelte";
	import Navbar from "../components/navbar.svelte";
	import NotificationLabel from "../components/notificationLabel.svelte";
	import page from "page";

	let stylesOfButton = "";
	let clicked = false;
	let labelOfLoginButton = "Sign up!";
	let errorMessage;

	let username = "";
	let email = "";
	let password = "";
	

	async function register(){
		if (clicked) return;

        clicked = true;
        stylesOfButton = "processing";
		if (username === "" || email === "" || password === ""){
			errorMessage = "Missing email, username or password";
			clicked = false;
			stylesOfButton = "";
			return;
		}
		let registrationData = {
			email: email,
			username: username,
			password: password
		};

		try {
			let response = await registerNewUser(registrationData);
			page('/login?message=Registration successful!&type=i');
		} catch (e) {
			errorMessage = e.message;
			clicked = false;
			stylesOfButton = "";
		}
    }

    const onEmailEnter = (e) => email = e.detail;

    const onUsernameEnter = (e) => username = e.detail;

    const onPasswordEnter = (e) => password = e.detail;

</script>

<svelte:head>
  <title>compReset - Register</title>
</svelte:head>

<Navbar styles='absolute inset-x-0 top-0'/>

<main>
	<section class="flex justify-center items-center h-screen">
		<Container heading="Register" subHeading="Sign up to the system" styles="mt-10 flex flex-col w- items-center w-96">
			<p class="mt-5">Username:</p>
			<TextInput instruction="Unique username" on:textEntered={onUsernameEnter}/>
            <p class="mt-5">Email:</p>
			<TextInput instruction="Email address" on:textEntered={onEmailEnter}/>
			<p class="mt-5">New Password:</p>
			<TextInput isPassword=true instruction="Account password" on:textEntered={onPasswordEnter}/> 
			<br/>
			<section class="flex justify-center">
				<ActionButton label="{labelOfLoginButton}" styles="{stylesOfButton} m-1" onClick={register}/>
			</section>
			{#if (errorMessage)}
				<NotificationLabel type="e" message="{errorMessage}"/>
			{/if}
		</Container>
	</section>
</main>