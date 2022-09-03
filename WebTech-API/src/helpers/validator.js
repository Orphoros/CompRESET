class validator {
    /**
     * Validates the format of an email
     * @param {String} email Email to validate
     * @returns True if email is valid
     */
    static validateEmail(email){
        let emailRegex = new RegExp('(?:[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*|"(?:[\x21\x23-\x5b\x5d-\x7f]|\\\\[\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x21-\x5a\x53-\x7f]|\\\\[x7f])+)\\])');
        return emailRegex.test(email);
    }

    /**
     * Validates the format of a password
     * Checks if the password is 8 characters long, has at least one number, has at least one upper case letter and one special character (@$!%*?&)
     * @param {*} pw Password to validate
     * @returns True of password is valid
     */
    static validatePassword(pw){
        let passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$');
        return passwordRegex.test(pw);
    }

    /**
     * Validates HTTP request body, params and query for XSS
     * @param {*} userRequest Http request
     * @returns True if XSS was found!
     */
    static validateUserStringForXSS(userRequest){
        let hasXSSfound = false;
        let jsXSSRegex = new RegExp('<(|\\/|[^\\/>][^>]+|\\/[^>][^>]+)>');
        if (Object.keys(userRequest.body).length !== 0) {
            hasXSSfound = jsXSSRegex.test(JSON.stringify(userRequest.body));
            return hasXSSfound;
        }
        if (Object.keys(userRequest.params).length !== 0) {
            hasXSSfound = jsXSSRegex.test(JSON.stringify(userRequest.params));
            return hasXSSfound;
        }
        if (Object.keys(userRequest.query).length !== 0) {
            hasXSSfound = jsXSSRegex.test(JSON.stringify(userRequest.query));
            return hasXSSfound;
        }
    }

}
module.exports = validator;