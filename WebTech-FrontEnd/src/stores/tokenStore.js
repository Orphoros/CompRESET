import { writable } from "svelte/store";

/**
 * Storage to store user token
 */
export default writable({
    token: ""
});