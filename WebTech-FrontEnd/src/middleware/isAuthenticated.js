import tokenStore from "../stores/tokenStore";
import jwtDecode from "jwt-decode";
import page from "page";

/**
 * Middleware to check for logged in user.
 * Used for pages that only logged in users can view
 * Redirects to login if current client is not logged in
 * @param {*} ctx 
 * @param {*} next 
 */
export default function(ctx, next){
    let token;
    tokenStore.subscribe(tokenValue => {
        token = tokenValue.token;
    });
    try{
        token = jwtDecode(token);
        if (token) next();
    } catch (e) {page('/login?message=Please sign in to access protected pages&type=i');}
}