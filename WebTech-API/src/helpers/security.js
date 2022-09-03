const bcrypt = require('bcrypt');

class security {
    /**
     * Returns the Hash of a given string
     * @param {String} string
     * @returns 
     */
    static getHash(string){
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(string,salt);
    }

    /**
     * Compares the hash to an input
     * @param {String} hash 
     * @param {String} input 
     * @returns True of the hash matches the input
     */
    static checkHash(hash, input){
        return bcrypt.compareSync(input,hash);
    }
}

module.exports = security;