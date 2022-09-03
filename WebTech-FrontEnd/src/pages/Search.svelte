<script>
    import { onMount } from 'svelte';
    import page from 'page';
    import qs from "qs";
    import {getItems, getDataPresets} from "../helpers/apiLink";

    import Navbar from "../components/navbar.svelte";
    import ListingThumbnailSet from "../components/listingThumbnailSet.svelte";
    import ItemPropEditor from '../components/itemPropEditor.svelte';
    import ActionButton from "../components/actionButton.svelte"; 
    import PageTitle from "../components/pageTitle.svelte";

    let searchParams;

    let filters = {};
    let queryDecode = "All listings";
    let pageNum = 1;
    let outItems = [];
    let redirectQueryBuilder = {};
    let lastPage = false;
    let firstPage = false;

    let items = [];

    const decodeParameters = () => {
        if (Object.keys(searchParams).length === 0){
            redirectQueryBuilder = {};
            queryDecode = "All listings";
        }
        if (searchParams.name) {
            redirectQueryBuilder.name = searchParams.name;
            queryDecode = searchParams.name;
        }
        if (searchParams.page) {
            redirectQueryBuilder.page = searchParams.page;
            pageNum = parseInt(searchParams.page);
        } else if (redirectQueryBuilder.page) page("/search?"+qs.stringify(redirectQueryBuilder));
        if (searchParams.name) redirectQueryBuilder.name = searchParams.name;
        if (searchParams.isSold) redirectQueryBuilder.isSold = (searchParams.isSold==='true');
        if (searchParams.manufacturingYear) redirectQueryBuilder.manufacturingYear = searchParams.manufacturingYear;
        if (searchParams.cpu) redirectQueryBuilder.cpu = searchParams.cpu;
        if (searchParams.maxRam) redirectQueryBuilder.maxRam = searchParams.maxRam;
        if (searchParams.expansionSlots) redirectQueryBuilder.expansionSlots = searchParams.expansionSlots;
        if (searchParams.itemCondition) redirectQueryBuilder.itemCondition = searchParams.itemCondition;
    };

    const pageNumCheck = () => {
        if (pageNum < 1 || (pageNum-1)*8 > items.length) {
            redirectQueryBuilder.page = 1;
            page("/search?"+qs.stringify(redirectQueryBuilder));
        }
        if ((pageNum+1)*8 > items.length) lastPage = true;
        else lastPage = false;

        if (pageNum-2 < 0) firstPage = true;
        else firstPage = false;
    };

    const pageChange = async (isForward) => {
        if (isForward && !lastPage) redirectQueryBuilder.page = pageNum+1;
        if (!isForward && !firstPage) redirectQueryBuilder.page = pageNum-1;
        searchParams = qs.stringify(redirectQueryBuilder);
        page("/search?"+qs.stringify(redirectQueryBuilder));
        await update();
    };
    
    const onFilterUpdate = async (e) => {
        let currentPage = redirectQueryBuilder.page;
        filters = e.detail;
        if (redirectQueryBuilder.name) filters.name = redirectQueryBuilder.name;
        redirectQueryBuilder = filters;
        if (currentPage) redirectQueryBuilder.page = currentPage;
        searchParams = qs.stringify(redirectQueryBuilder);
        page("/search?"+qs.stringify(redirectQueryBuilder));
        await update();
    };

    const update = async () => {
        searchParams = qs.parse(location.search.slice(1));
        decodeParameters();
        filters = redirectQueryBuilder;
        delete filters.page;
        try{items = await getItems(qs.stringify(filters));}
        catch (e) {
            if (e.status !== 400) page(`/error?message=${e.message}&code=${e.status}`);
            else items=[];
        }
        pageNumCheck();
        outItems = items.slice((pageNum-1)*8, (pageNum-1)*8+8);
    }

    onMount(async () => await update());
</script>

<svelte:head>
  <title>compReset</title>
</svelte:head>

<Navbar tab='search' onSearch={async (e) => {
    if (e.detail === null || e.detail === "") {
        searchParams = {};
        page('/search');
        await update();
    }
    else {
        searchParams = {
            name:e.detail
        }
        page('/search?name='+e.detail);
        await update();
    }
}}/>

<main>
    <PageTitle>Searching for:</PageTitle>
    <p class="text-center text-xl md:text-2xl lg:text-4xl text-compResetLink">{queryDecode}</p>
    <h2 class="italic lg:text-2xl md:text-xl text-center uppercase mt-3 mb-5">Page {pageNum}</h2>

    <div class="flex justify-between flex-col lg:flex-row">
        <section class="flex">
            <ItemPropEditor title="Filters" buttonLabel="Filter" mode="filter" on:editorSubmit={onFilterUpdate} 
            toggle={filters.isSold ? filters.isSold : false}
            cpu={filters.cpu ? filters.cpu : ""}
            expansionSlots={filters.expansionSlots ? filters.expansionSlots : -1}
            itemCondition={filters.itemCondition ? filters.itemCondition : ""}/>
        </section>
        
        <ListingThumbnailSet items={outItems}/>
    </div>

</main>

<footer class="my-5 grid justify-items-center {firstPage && lastPage ? 'hidden' : ''}">
    <div>
        <ActionButton styles="{firstPage ? "disabled" : ""}" label="<- Previous page" onClick={async () => await pageChange(false)}/>
        <ActionButton styles="{lastPage ? "disabled" : ""}" label="Next page ->" onClick={async () => await pageChange(true)}/>
    </div>
</footer>