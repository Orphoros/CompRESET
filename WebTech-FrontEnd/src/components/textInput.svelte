<script>
    import { createEventDispatcher } from 'svelte';

    export let isPassword = false;
    export let instruction = "Enter text here";
    export let styles = "";

    const dispatch = createEventDispatcher();

    let type = isPassword ? "password" : "textbox";
    let inputString = "";

    const handleInput = e => {
        inputString = e.target.value;
        dispatch('textEntered', inputString);
    }
</script>

<input class="object-scale-down rounded-3xl outline-none h-8 max-w-xs lg:w-72 px-2 bg-compResetInput text-compResetText border-compResetOutline {styles}" type={type} placeholder={instruction} value={inputString} on:input={handleInput} />