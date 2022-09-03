import tokenStore from "../stores/tokenStore";
import jwtDecode from "jwt-decode";
import page from "page";

/**
 * Middleware to check for admin user.
 * Used for pages that only admins can view.
 * Redirects to login if current user is not admin
 * @param {*} ctx 
 * @param {*} next 
 */
export default function(ctx, next){
    let token;
    tokenStore.subscribe(tokenValue => {
        token = tokenValue.token;
    });
    try {
        token = jwtDecode(token);
        if (token.isAdmin) next();
    }
    catch (e) {page('/login?message=Please sign in as an admin&type=e');}
}