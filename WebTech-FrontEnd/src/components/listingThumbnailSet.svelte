<script>
    import ListingThumbnail from "./listingThumbnail.svelte";
    import Set from "./set.svelte";
    export let items = [];
</script>

<Set>
    {#each items as item}
        <ListingThumbnail imgLink="/comp.png" itemName={item.name} itemDescription={item.description} itemPrice={item.latestBid} buyer={item.isSold ? item.buyer : undefined} listingLink='/listings/{item.itemID}'/>
	{/each}
</Set>