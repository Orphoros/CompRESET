<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import {getDataPresets} from "../helpers/apiLink";

    import Container from "./container.svelte";
    import NumInput from "./numInput.svelte";
    import TextInput from "./textInput.svelte";
    import ActionButton from "./actionButton.svelte";

    export let title;
    export let buttonLabel;
    export let mode;
    export let styles = "";
    export let toggle = false;
    export let expansionSlots = -1;
    let manufacturingYear = -1;
    let maxRAM = -1;
    export let cpu = "";
    export let itemCondition = "";
    export let auctionEndTime = "";
    let name = "";
    export let description = "";
    let minBid = -1;

    const dispatch = createEventDispatcher();

    let cpuList = [];
    let conditionList = [];

    const onSubmit = () => {
        let submitting = {};
        if (expansionSlots !== -1) submitting.expansionSlots = expansionSlots;
        if (manufacturingYear !== -1) submitting.manufacturingYear = manufacturingYear;
        if (maxRAM !== -1) submitting.maxRAM = maxRAM;
        if (cpu !== "") submitting.cpu = cpu;
        if (itemCondition !== "") submitting.itemCondition = itemCondition;
        if (auctionEndTime !== "") submitting.auctionEndTime = auctionEndTime;
        if (name !== "") submitting.name = name;
        if (description !== "") submitting.description = description;
        if (minBid !== -1) submitting.minBid = minBid;
        if (mode === "filter") submitting.isSold = toggle;
        if (mode === "editor") submitting.isPublic = toggle;
        console.log(submitting);
        dispatch('editorSubmit', submitting);
    };

    const onEXPAdjust = (e) => expansionSlots = e.target.value;

    const onManufAdjust = (e) => {
        if (e.detail < 1960 || e.detail > 9999) return;
        manufacturingYear = e.detail;
    };

    const onCPUAdjust = (e) => cpu = e.target.value;

    const onRAMAdjust = (e) => {
        if (e.detail < 1) return;
        maxRAM = e.detail;
    }

    const onCondAdjust = (e) => itemCondition = e.target.value;

    const onDateAdjust = (e) => auctionEndTime = new Date(e.target.value).toJSON();

    const onToggleAdjust = () => toggle = !toggle;

    const onTitleAdjust = (e) => name = e.detail;

    const onDescriptionAdjust = (e) => description = e.target.value;

    const onMinBidAdjust = (e) => {
        if (e.detail < 1) return;
        minBid = e.detail;
    };

    onMount(async () => {
        let dataPresets = await getDataPresets();
        cpuList = dataPresets.cpus;
        conditionList = dataPresets.conditions;
    })

</script>

<Container heading={title} styles="flex flex-1 flex-col place-items-center mb-5 max-w-full w-max lg:mb-0 {styles}">
    <table class="border-spacing mt-1">
        {#if (mode === "creator")}
            <tr>
                <td><p>Title</p></td>
                <td><TextInput instruction="Auction title" on:textEntered={onTitleAdjust} styles="w-40 md:w-auto"/></td>
            </tr>
            <tr>
                <td><label for="description">Auction description:</label></td>
                <td>
                    <textarea id="description" name="description" class="w-40 md:w-auto" cols="40" on:input={onDescriptionAdjust}/>
                </td>
            </tr>
        {/if}
        <tr>
            <td><p>Manufacturing year</p></td>
            <td><NumInput instruction="Manufacturing Year" styles="w-40 md:w-auto" min=1960 max=9999 on:numEntered={onManufAdjust}/></td>
        </tr>
        <tr>
            <td><label for="cpu" class="inline">Architecture:</label></td>
            <td>
                <select name="cpu" id="cpu" class="inline w-40 md:w-auto" on:input={onCPUAdjust}>
                    <option selected={cpu === "" ? 'selected' : ''} value="">Any</option>
                    {#each cpuList as cpuSel}
                        <option selected={cpu === cpuSel.name ? 'selected' : ''} value={cpuSel.name}>{cpuSel.name}</option>
                    {/each}
                </select>
            </td>
        </tr>
        <tr>
            <td><p>RAM (kb)</p></td>
            <td><NumInput styles="w-40 md:w-auto" instruction="RAM (kB)" min=64 max=64000000 on:numEntered={onRAMAdjust}/></td>
        </tr>
        <tr>
            <td>
                <label for="exp" class="inline">Expansion slots:</label>
                <p class="inline">{expansionSlots === -1 ? 'None' : expansionSlots}</p>
            </td>
            <td><input class="w-40 md:w-auto" type="range" id="exp" name="exp" min="0" max="6" value={expansionSlots} on:input={onEXPAdjust}></td>
        </tr>
        <tr>
            <td><label for="condition" class="inline">Condition:</label></td>
            <td>
                <select name="condition" id="condition" class="inline w-40 md:w-auto" on:input={onCondAdjust}>
                    <option selected={itemCondition === "" ? 'selected' : ''} value="">Any</option>
                    {#each conditionList as conditSel}
                        <option selected={itemCondition === conditSel.name ? 'selected' : ''} value={conditSel.name}>{conditSel.name}</option>
                    {/each}
                </select>
            </td>
        </tr>
        {#if mode === 'editor'}
            <tr>
                <td><label for="public">Public</label></td>
                <td><input class="w-40 md:w-auto" type="checkbox" id="public" name="public" on:input={onToggleAdjust} checked={toggle}></td>
            </tr>   
        {:else}
            <tr>
                <td><label for="endTime" class="inline">Auction end time:</label></td>
                <td><input class="w-40 md:w-auto" type="datetime-local" id="endTime" name="endTime" on:input={onDateAdjust}></td>
            </tr>
        {/if}
        {#if mode === 'creator'}
            <tr>
                <td><p>Minimum bid</p></td>
                <td><NumInput styles="w-40 md:w-auto" instruction="Euros (€)" min=1 on:numEntered={onMinBidAdjust}/></td>
            </tr>
        {/if}
        {#if mode === 'filter'}
            <tr>
                <td><label for="sold">Sold items only</label></td>
                <td><input class="w-40 md:w-auto" type="checkbox" id="sold" name="sold" on:input={onToggleAdjust} checked={toggle}></td>
            </tr>  
        {/if}
    </table>
    <ActionButton label={buttonLabel} onClick={onSubmit}/>
</Container>