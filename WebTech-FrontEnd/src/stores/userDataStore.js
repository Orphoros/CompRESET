import { writable } from "svelte/store";

/**
 * Storage to store logged in user data
 */
export default writable({
    username: "",
    isAdmin: false
});