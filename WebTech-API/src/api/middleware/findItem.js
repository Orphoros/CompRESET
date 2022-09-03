const httpError = require('../../model/httpError');
const {findItemData} = require('../../helpers/lookups');

/**
 * Middleware for automatically getting an item based on the Item ID of the request parameter
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns next() if item was found, else throws HTTP Not Found
 */
const findItem = (req,res,next) => {
    const item = findItemData(req.params.itemID, req.headers['authorization']);
    if (!item) return new httpError(req,res,404,`The item with ID ${req.params.itemID} does not exist`);
    req.item = item;
    return next();
};

module.exports = {findItem};