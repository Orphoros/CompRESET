const httpError = require('../../model/httpError');
const {validateUserStringForXSS} = require('../../helpers/validator');

/**
 * Middleware for XSS checking.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns next() if no XSS was found, else returns HTTP Bad Request
 */
const isXSSsafe = (req,res,next) => {
    const response = validateUserStringForXSS(req);
    if (response) return new httpError(req,res,400,'Suspicious string detected. Could it be an impostor XSS?');
    else return next();
};

module.exports = {isXSSsafe};