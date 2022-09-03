<script>
    import { onMount } from "svelte";
    import page from "page";
    import {getItems,deleteAuction} from "../helpers/apiLink";

    import Navbar from "../components/navbar.svelte";
    import Container from "../components/container.svelte";
    import ActionButton from "../components/actionButton.svelte";
    import NotificationLabel from "../components/notificationLabel.svelte";
    import PageTitle from "../components/pageTitle.svelte";
    import Set from "../components/set.svelte";

    let listings = [];
    let messageBoxContent;
    let messageBoxType;

    const requestDelete = async (listing) => {
        let confirmation = confirm("Are you sure you would like to delete this auction? This action is irreversible!");
        if (!confirmation) return;
        try{
            await deleteAuction(listing.itemID);
            await update();
        }
        catch (e){
            messageBoxContent = e.message;
            messageBoxType = "e";
            return;
        }
        messageBoxContent = "Successfully deleted item with ID "+listing.itemID;
        messageBoxType = "i";
        listings.slice(listings.indexOf(listing),1);
    }

    const update = async () => {
        let items
        try{items = await getItems();}
        catch (e) {page(`/error?message=${e.message}&code=${e.status}`);}
        console.log(items);
        items.forEach(item => {
            let listing = {
                itemName: item.name,
                seller: item.sellerID,
                itemPrice: item.latestBid,
                bids: item.bidCount,
                itemID: item.itemID,
                auctionEndTime: item.auctionEndTime
            };
            listings.push(listing);
        });
        listings = listings;
    };

    onMount(async () => {
        await update();
    });
</script>

<svelte:head>
  <title>compReset - Admins</title>
</svelte:head>

<Navbar tab='admin'/>
<main>
    <PageTitle>Admin: Active auctions</PageTitle>
    {#if (messageBoxContent)}
        <NotificationLabel type={messageBoxType} message="{messageBoxContent}"/>
    {/if}
    <Set>
        {#each listings as listing}
            <Container heading={listing.itemName} subHeading={"Seller: "+listing.seller} styles="w-96">
                <table class="">
                    <tr>
                        <td>ID:</td>
                        <td class="pl-4">{listing.itemID}</td>
                    </tr>
                    <tr>
                        <td>Price:</td>
                        <td class="pl-4">{listing.itemPrice}</td>
                    </tr>
                    {#if listing.isSold}
                        <tr>
                            <td>{listing.buyer === null ? 'Auction over' : 'Sold to:'}</td>
                            <td class="pl-4">{listing.buyer === null ? '' : listing.buyer}</td>
                        </tr>
                    {:else}
                        <tr>
                            <td>End time:</td>
                            <td class="pl-4">{new Date(listing.auctionEndTime)}</td>
                        </tr>
                    {/if}
                </table>
                {#if !listing.isSold}
                    <ActionButton label="Edit auction" onClick = {() => {page(`/listings/${listing.itemID}`)}}/>
                {/if}
                <ActionButton label="Delete auction" onClick = {() => {requestDelete(listing)}} styles="bg-red-600"/>
            </Container>
        {/each}
        </Set>
</main>