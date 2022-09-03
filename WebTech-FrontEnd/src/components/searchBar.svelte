<script>
    import TextInput from "./textInput.svelte";
    import ActionButton from "./actionButton.svelte";
    import { createEventDispatcher } from 'svelte';

    let searchQuery;

    const dispatch = createEventDispatcher();

    const onTextEntry = (e) => {
        searchQuery = e.detail;
    }
    
    const onSearchClick = () => {
        dispatch('searchRequested', searchQuery);
    }
</script>

<TextInput instruction="Search by title..." on:textEntered={onTextEntry} styles="lg:inline"/>

<div class="ml-2 lg:inline mt-2 lg:mt-0">
    <ActionButton styles="search-button" label="Search" onClick={onSearchClick}/>
</div>
