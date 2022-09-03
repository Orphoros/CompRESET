const httpError = require('../../model/httpError');
const jwt = require('jsonwebtoken');

const { users, invalidTokens } = require('../data/userData');

/**
 * Middleware to check for mandatory authorization.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns next() if authenticated, else returns HTTP Unauthorized
 */
const isAuthenticated = (req,res,next) => {
    const response = authCheck(req.headers['authorization']);
    if (!response){return new httpError(req,res,401,'Incorrect or empty token data');}
    else{
        req.user = response;
        return next();
    }
};

/**
 * Token check
 * @param {*} token 
 * @returns True if token was validated
 */
const authCheck = (token) => {
    if (token) {
        if (invalidTokens.find(t => t === token)){return false;}
        token = token.split(' ')[1];
        const tokenPayload = jwt.decode(token);
        if (tokenPayload){
            const foundUser = users.find(u => u.username === tokenPayload.username);
            if (!foundUser){return false;}
            try{if (jwt.verify(token,foundUser.secret)){return foundUser;}}
            catch{return false;}
        }
        else{return false;}
    }
    else{return false;}
};

module.exports = {isAuthenticated,authCheck};