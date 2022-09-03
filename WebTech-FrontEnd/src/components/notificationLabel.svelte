<script>
    export let message = "Something happened";
    export let type = "i"
    export let styles = "";

    let icon;
    let iconStyle;
    let messageStyle;

    if(type === "i") {
        icon = "i";
        messageStyle="bg-blue-400";
        iconStyle="bg-blue-600";
    } else if (type === "e"){
        icon = "!"
        messageStyle="bg-red-600";
        iconStyle="bg-red-800";
    }else {
        icon = "!";
        messageStyle="bg-yellow-600";
        iconStyle="bg-yellow-800";
    }

    const handleInput = e => {
        inputString = e.target.value;
        dispatch('textEntered', inputString);
    }
</script>

<section class="flex m-2 {styles}">
    <div class="border-dashed border-t-2 border-l-2 border-b-2 max-w-md px-3 {iconStyle}">
        <p class="text-center font-bold text-white">{icon}</p>
    </div>

    <div class="rounded-r-lg border-dashed border-2 px-2 text-white {messageStyle}">
        <p>{message}</p>
    </div>
</section>