<script>
    import Container from "./container.svelte";
    export let imgLink, itemName, itemDescription, itemPrice, listingLink;
    export let buyer;
    export let styles = '';
</script>

<div class='text-center max-w-xs'>
    <a href={listingLink}>
        <Container heading={itemName} subHeading={itemDescription} styles={styles}>
            <img src={imgLink} alt='A test alt because I am luckily sighted' class='object-scale-down'/>
            {#if buyer === null}
                <b class="text-2xl text-green-600">Ended! No buyer</b>
            {:else if buyer === undefined}
                <b class="text-2xl text-red-400">Current bid: {itemPrice}</b>
            {:else}
                <b class="text-2xl text-green-600">Sold! Buyer: {buyer}</b>
            {/if}
        </Container>
    </a>
</div>