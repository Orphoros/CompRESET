<script>
    import { onMount } from "svelte";
    import page from "page";
    import {getItem,getBids,updateAuction,placeBid,deleteBid} from "../helpers/apiLink";
    import userDataStore from "../stores/userDataStore";

    import Container from "../components/container.svelte";
    import Navbar from "../components/navbar.svelte";
    import ItemPropEditor from "../components/itemPropEditor.svelte";
    import NumInput from "../components/numInput.svelte";
    import ActionButton from "../components/ActionButton.svelte";
    import NotificationLabel from "../components/notificationLabel.svelte";
    import PageTitle from "../components/pageTitle.svelte";

    export let params;

    let messageBoxContent;
    let messageBoxType;
    let itemData = {};
    let bidData = [];
    let selectedBid = -1;
    let isEditMode = false;
    let allowBidding = false;
    let endDate = new Date();

    let days, hours, minutes, seconds;


    const update = async () => {
      try{
        itemData = await getItem(params.id);
        bidData = await getBids(params.id);
      } catch (e) {page(`/error?message=${e.message}&code=${e.status}`);}
      if (!itemData.isPublic){
        messageBoxContent = "This item is not yet visible to the public!";
        messageBoxType = "i";
      }
      endDate = new Date(itemData.auctionEndTime);
      console.log(itemData.latestBid);
    };

    const countdown = setInterval(async function() {
      if (itemData.isSold) clearInterval(countdown);
      let now = new Date().getTime();
      let difference = endDate - now;

      days = Math.floor(difference / (1000 * 60 * 60 * 24));
      hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (difference < 0 && location.pathname === `/listings/${itemData.itemID}`) {
        await update();
      }
    }, 250);

    const onBidEntry = (e) => {
      if (e.detail > itemData.latestBid) {
        selectedBid = e.detail;
        allowBidding = true;
      }
      else allowBidding = false;
    };

    const onBidPlacement = async () => {
      let bid = {price: selectedBid};
      try {
        await placeBid(itemData.itemID,bid);
        messageBoxContent = "Bid placed successfully";
        messageBoxType = "i";
        await update();
      } catch(e){
        messageBoxContent = e.message;
        messageBoxType = "e";
      }

    };
        
    const onEditActivate = () => {isEditMode = true;}

    const removeBid = async (bidID) => {
      try {
        await deleteBid(bidID);
        messageBoxContent = "Bid deleted successfully";
        messageBoxType = "i";
        await update();
      } catch(e){
        messageBoxContent = e.message;
        messageBoxType = "e";
      }
    }

    const onEditSave = async (e) => {
      let editorData = e.detail;
      console.log(editorData);
      if (Object.keys(editorData).length === 0) return;
      try{
        let response = await updateAuction(itemData.itemID, editorData);
        itemData = response;
        if (!itemData.isPublic){
          messageBoxContent = "This item is not yet visible to the public!";
          messageBoxType = "i";
        } else {
          messageBoxContent = undefined;
          messageBoxType = undefined;
        }
      } catch(e){
        messageBoxContent = e.message;
        messageBoxType = "e";
      } finally{isEditMode = false;}
    }

    onMount(async () => {
      await update();
    });
</script>

<svelte:head>
  <title>compReset - Overview</title>
</svelte:head>

<Navbar/>
<main>
    <div class="p-5">
        <PageTitle>{itemData.name}</PageTitle>
        <h1 class="text-center italic">ID: {itemData.itemID}</h1>
        <h1 class="text-center italic text-xl">Seller: <a class="text-compResetLink hover:underline" href={'/users/'+itemData.sellerID}>{itemData.sellerID}</a></h1>
        {#if messageBoxContent}
        <div class="flex justify-center">
          <NotificationLabel type={messageBoxType} message={messageBoxContent}/>
        </div>
        {/if}

      <div class="flex md:flex-row flex-col justify-items-center">
        <section class="flex-auto md:w-1/3 lg:w-1/3">
          <Container heading="Bids" styles="min-w-min">
            {#if itemData.buyer !== undefined}
              {#if itemData.buyer === null}
                <p class="font-bold text-green-600 italic text-xl">Auction over!</p>
                <h1 class="mb-10 text-3xl">Buyer: <span class="text-compResetLink">No one</span></h1>
              {:else}
                <p class="font-bold text-green-600 italic text-xl">Item Sold!</p>
                {#if itemData.buyer === "[DELETED USER]"}
                  <h1 class="mb-10 text-3xl">Buyer: <span class="text-compResetLink">{itemData.buyer}</span></h1>
                {:else}
                  <h1 class="mb-10 text-3xl">Buyer: <a class="text-compResetLink hover:underline" href={"/users/"+itemData.buyer}>{itemData.buyer}</a></h1>
                {/if}
              {/if}
            {:else}
              <h1 class="mb-10 text-3xl">Time remaining till auction ends: <span class="text-green-300">{days}D {hours}H {minutes}M {seconds}S</span></h1>
            {/if}
            <table>
              <thead>
                <tr>
                  <th class="w-1/2">Username</th>
                  <th class="w-1/4">Value (€)</th>
                </tr>
              </thead>
              <tbody>
                {#each bidData as bid}
                  <tr>
                    <td>{bid.bidder}</td>
                    <td>{bid.price}</td>
                    <td>
                      {#if (($userDataStore.isAdmin || bid.bidder === $userDataStore.username) && !itemData.isSold)}
                        <ActionButton label="Remove" styles="bg-red-600" onClick={async () => {
                          try{await removeBid(bid.bidID);}
                          catch (e) {page(`/error?message=${e.message}&code=${e.status}`);}
                        }}/>
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </Container>
    
          {#if $userDataStore.username && !itemData.isSold && $userDataStore.username !== itemData.sellerID}
            <Container heading="New Bid" styles="mt-5 min-w-min flex flex-col items-center">
                <p class="mt-5">Your bid:</p>
                <NumInput instruction="Euros (€)" min={itemData.latestBid+1} on:numEntered={onBidEntry}/><br/>
                <ActionButton label="Add Bid!" onClick={onBidPlacement} styles="m-1 button {allowBidding ? '' : 'disabled'}"/>
            </Container>
          {/if}
        </section>
        <section class="md:w-1/3 lg:w-1/3">
          <div class="inline">
            <p class="font-bold text-compResetLink inline mx-10">Description:</p>
            <p class="text-justify mx-10">{itemData.description}</p>
          </div>
        </section>
        <section class="flex-none md:w-1/3 lg:w-1/3">
          {#if isEditMode}
            <ItemPropEditor title="Edit listing" styles="min-w-min" buttonLabel="Save" mode="editor" on:editorSubmit={onEditSave}
            toggle={itemData.isPublic}
            auctionEndTime={endDate.toJSON()},
            cpu={itemData.cpu},
            description={itemData.description}
            expansionSlots={itemData.expansionSlots}
            itemCondition={itemData.itemCondition}/>
          {:else}
            <Container heading="Details" styles="min-w-min " subHeading="Item properties">
              <p class="font-bold text-compResetLink inline">Current price: </p>
              <p class="float-right inline text-yellow-400 text-xl">{itemData.latestBid}€</p>
              <table class="mt-8">
                  <tr>
                    <td class="mt-8 font-bold  text-compResetLink">Manufacturing year:</td>
                    <td>{itemData.manufacturingYear}</td>
                  </tr>
                  <tr>
                      <td class="mt-8 font-bold text-compResetLink">CPU:</td>
                      <td>{itemData.cpu}</td>
                  </tr>
                  <tr>
                      <td class="mt-8 font-bold text-compResetLink">Max RAM:</td>
                      <td>{itemData.maxRAM} (kB)</td>
                  </tr>
                  <tr>
                      <td class="mt-8 font-bold text-compResetLink">Expansion Slots:</td>
                      <td>{itemData.expansionSlots}</td>
                  </tr>
                  <tr>
                      <td class="mt-8 font-bold text-compResetLink">Condition:</td>
                      <td>{itemData.itemCondition}</td>
                  </tr>
                  <tr>
                      <td class="mt-8 font-bold text-compResetLink">Auction end:</td>
                      <td>{endDate.getDay()}-{endDate.getMonth()+1}-{endDate.getFullYear()} {endDate.getHours()}:{endDate.getMinutes()}</td>
                  </tr>
              </table> 
              <section class="flex justify-center mt-1">
                {#if ($userDataStore.username === itemData.sellerID || $userDataStore.isAdmin) && !itemData.isSold}
                  <ActionButton label="Edit Listing" onClick={onEditActivate}/>
                {/if}
              </section>
            </Container>
          {/if}
        </section>
      </div>
    </div>
</main>