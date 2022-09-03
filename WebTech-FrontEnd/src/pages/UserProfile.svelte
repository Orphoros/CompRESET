<script>
    import { onMount } from 'svelte';
    import page from 'page';
    import {getItems,getUser, updateUser, deleteUser} from "../helpers/apiLink";
    import userDataStore from "../stores/userDataStore";
    import tokenStore from "../stores/tokenStore";

	import ActionButton from "../components/actionButton.svelte";
	import Navbar from "../components/navbar.svelte";
    import ListingThumbnailSet from "../components/listingThumbnailSet.svelte";
    import TextInput from "../components/textInput.svelte";
    import NotificationLabel from "../components/notificationLabel.svelte";

    export let params;

    let userData = {};
    let sellingItems = [];
    let boughtItems = [];
    let soldItems = 0;

    let newEmail = "";
    let newPassword = "";
    let messageBoxContent;
    let messageBoxType;

    let isEditMode = false;

    const onEditActivate = () => {isEditMode = true;}

    const onEmailEntry = (e) => {newEmail = e.detail};
    const onPasswordEntry = (e) => {newPassword = e.detail};
    
    const onEditSave = async () => {
      let editorData = {};
      if (newEmail !== "") editorData.email = newEmail;
      if (newPassword !== "") editorData.password = newPassword;
      if (Object.keys(editorData).length === 0) return;
      try{
        await updateUser(userData.username, editorData);
        newEmail = "";
        newPassword = "";
        messageBoxContent = "Profile updated successfully!";
        messageBoxType = "i";
      } catch(e){
        messageBoxContent = e.message;
        messageBoxType = "e";
      } finally{isEditMode = false;}
    };

    const onDeleteUser = async () => {
      let confirmation = confirm("Are you sure you would like to delete this account? This action is irreversible!");
      if (!confirmation) return;
      try{
        await deleteUser(userData.username);
        if (!$userDataStore.isAdmin){
            $userDataStore.username = '';
		    $tokenStore.token = '';
            page('/login?message=The account has been successfully deleted!&type=i');
        } else {page('/admin');}
        
      } catch(e){
        messageBoxContent = e.message;
        messageBoxType = "e";
      }
    };

    const update = async () => {
        try{
            userData = await getUser(params.username);
            sellingItems = await getItems('sellerID='+userData.username);
            boughtItems = await getItems('buyer='+userData.username);
            sellingItems.forEach(item => {if (item.isSold) soldItems+=1;});
        } catch (e) {page(`/error?message=${e.message}&code=${e.status}`);}
    };

    onMount(async () => update());
</script>

<svelte:head>
  <title>compReset - User Profile</title>
</svelte:head>

<Navbar styles='inset-x-0 top-0'/>

<main class="p-5 divide-y-4 divide-yellow-600 divide-dashed">
    <section class="flex space-x-4 py-5 flex-col md:flex-row">
        <div class="flex">
            <img src="/id.png" class="h-40 flex-initial" alt="ID">
            <div class="flex flex-col justify-center">
                <h1 class="text-compResetLink text-4xl font-bold">User: {userData.username}</h1>
                {#if userData.isAdmin}
                    <p class="text-md text-center text-white p-1 bg-yellow-400 rounded-lg">Verified admin</p>
                {/if}
            </div>
        </div>
        <div>
            <h1 class="underline text-xl">Stats:</h1>
            <table class="border-spacing">
                <tr>
                    <td>Items sold:</td>
                    <td class="mt-8 font-bold  text-compResetLink">{soldItems}</td>
                </tr>
                <tr>
                    <td>Items purchased:</td>
                    <td class="mt-8 font-bold text-compResetLink">{boughtItems.length}</td>
                </tr>
            </table>
            {#if (messageBoxContent)}
                <NotificationLabel type={messageBoxType} message="{messageBoxContent}"/>
            {/if}
        </div>

        {#if params.username === $userDataStore.username || $userDataStore.isAdmin}
        <div class="flex flex-col">
            {#if isEditMode}
                <table class="border-spacing mb-4">
                    <tr>
                        <td>Email:</td>
                        <TextInput instruction="New Email Address" on:textEntered={onEmailEntry}/>
                    </tr>
                    <tr>
                        <td>Password:</td>
                        <TextInput instruction="New Password" isPassword=true on:textEntered={onPasswordEntry}/>
                    </tr>
                </table>
                <div class="inline">
                    <ActionButton label="Save" onClick={onEditSave}/>
                    <ActionButton label="Cancel" onClick={() => {isEditMode = false;}}/>
                </div>
            {:else}
                {#if params.username === $userDataStore.username}
                    <ActionButton label="Edit Profile" onClick={onEditActivate}/> 
                    <br>
                {/if}
                <ActionButton styles="mt-3 bg-red-600" label="DELETE PROFILE" onClick={onDeleteUser}/>
            {/if}
        </div>
        {/if}
    </section>

    <section class="py-5">
        <h1 class="text-4xl font-bold inline">Items selling:</h1>
        {#if params.username === $userDataStore.username}
            <ActionButton label="Add new!" onClick={() => page("/sell")} styles="mb-5"/>
        {/if}
        <ListingThumbnailSet items={sellingItems}/>
    </section>

    <section class="py-5">
        <h1 class="text-4xl font-bold mb-5">Items purchased:</h1>
        <ListingThumbnailSet items={boughtItems}/>
    </section>
</main>