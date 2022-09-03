class User {
    constructor(email, username, hashedPsswd, secret, isAdmin){
        this.email = email;
        this.username = username;
        this.hashedPsswd = hashedPsswd;
        this.secret = secret;
        this.isAdmin = isAdmin;
    }

    /**
     * Converts the User object to JSON
     * @returns JSON String of the User object. Returns only secure values
     */
    toJSON(){
        return ({
            'username': this.username,
            'isAdmin': this.isAdmin
        });
    }
}
module.exports = User;