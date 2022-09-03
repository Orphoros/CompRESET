<script>
	export let label;
    export let styles = "";
    export let onClick;
</script>

<div class="button bg-compResetButton {styles}" on:click={onClick}>
    <p>{label}</p>
</div>

<style>
	.button {
        border: none;
        color: white;
        padding: 1rem;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        border-radius: 0.5rem;
        transition: all 0.5s;
        cursor: pointer;
        pointer-events: all;
    }
    .processing {
        filter: brightness(0.85);
        cursor: default;

    }
    .disabled{
        filter: brightness(0.50);
        color: gray;
        cursor: default;
        pointer-events: none;
    }
    .search-button{
        border: none;
        color: white;
        padding: 0.25rem;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        border-radius: 0.5rem;
        width: 4rem;
        transition: all 0.5s;
        cursor: pointer;
    }

    .processing p, .disabled p {
        cursor: default;
    }
    div p {
        cursor: pointer;
        display: inline-block;
        position: relative;
        transition: 0.5s;
    }

    div.disabled p {
        display: inline-block;
        position: relative;
    }
    div:hover{
        filter: brightness(0.85);
    }

    div:hover.disabled{
        filter: brightness(0.50);
    }

    div:hover p:after {
        opacity: 1;
        right: 0;
    }
    p {
        margin: 0;
    }
</style>