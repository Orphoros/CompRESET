<script>
    import Navbar from "../components/navbar.svelte";
    import ItemPropEditor from "../components/itemPropEditor.svelte";
    import NotificationLabel from "../components/notificationLabel.svelte";
    import PageTitle from "../components/pageTitle.svelte";
    import {postNewItem} from "../helpers/apiLink";
    import page from "page";

    let message;
    let type = "e";

    const addNewItem = async (e) => {
        let data = e.detail;
        console.info(data);
        if(!data.expansionSlots
            || !data.manufacturingYear
            || !data.maxRAM
            || !data.cpu
            || !data.itemCondition
            || !data.auctionEndTime
            || !data.name
            || !data.description
            || !data.minBid
        ) {
            message="Not all fields have been filled out correctly!";
            return;
        }
        try {
            let response = await postNewItem(data);
			page('/listings/'+response.itemID);
		} catch (err) {
            message = err.message;
		}
    }
</script>

<svelte:head>
  <title>compReset - Sell</title>
</svelte:head>

<Navbar tab='sell'/>
<main class="flex flex-col items-center">
    <PageTitle>Create a new auction</PageTitle>
    {#if (message)}
        <NotificationLabel type={type} message={message}/>
    {/if}
    <ItemPropEditor title="New item" buttonLabel="Create auction" on:editorSubmit={addNewItem} mode="creator" styles='max-w-xl'/>
</main>