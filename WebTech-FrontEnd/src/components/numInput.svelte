<script>
    import { createEventDispatcher } from 'svelte';

    export let instruction = "Enter number here";
    export let min = 0;
    export let max = 99999999999;
    export let styles = '';

    const dispatch = createEventDispatcher();

    let inputValue;

    const handleInput = e => {
        inputValue = e.target.value;
        dispatch('numEntered', inputValue);
    }
</script>

<input class="object-scale-down rounded-3xl outline-none h-8 max-w-xs lg:w-72 px-2 bg-compResetInput text-compResetText border-compResetOutline {styles}" type="number" placeholder={instruction} value={inputValue} min={min} max={max} on:input={handleInput} />
