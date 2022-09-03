const httpError = require('../model/httpError');
const {users} = require('../api/data/userData');
const items = require('../api/data/itemData');
const bids = require('../api/data/bidData');
const validator = require('../helpers/validator');
const {authCheck} = require('../api/middleware/isAuthenticated');

/**
 * This class finds and returns objects from the data store
 * If no object could be found, this class will also handle error responses if applicable
 */
class Lookups {
    /**
     * Check if a user already exists
     * If unexpected result is encountered, an HTTP Bad Request response will be issued
     * @param {*} req 
     * @param {*} res
     * @param {Boolean} isNew If false: we expect no user to be found
     * @param {Boolean} isUpdate If true: we expect to find a user (since we want to update it)
     * @returns The found user, if no user is found, returns an HTTP bad request response
     */
    static findUser(req, res, isNew, isUpdate) {
        if (req.body.email && !validator.validateEmail(req.body.email)){return new httpError(req, res, 400, `Invalid email format: ${req.body.email}`);}
        if (req.body.password && !validator.validatePassword(req.body.password)){return new httpError(req, res, 400, 'Invalid password format! Use 8 characters, at least one upper case letter, one number and one special character (!#$%&?)');}
        let user;
        if(req.body.username || req.params.username){
            let usernameUser;
            if (req.body.username) usernameUser = users.find(u => u.username === req.body.username);
            if (req.params.username && !usernameUser) usernameUser = users.find(u => u.username === req.params.username);
            if (isNew && usernameUser){return new httpError(req,res,400,`User with username ${req.body.username} already exists`);}
            if (!isNew && !usernameUser){return new httpError(req,res,400,`User with username ${req.body.username} does not exist or password is incorrect`);}
            user = usernameUser;
        }
        if(req.body.email){
            let emailUser = users.find(u => u.email === req.body.email);
            if ((isNew || isUpdate) && emailUser){return new httpError(req,res,400,`User with email address ${req.body.email} already exists`);}
            if ((!isNew && !isUpdate) && !emailUser){return new httpError(req,res,400,`User with email ${req.body.email} does not exist or password is incorrect`);}
            if (!user) user = emailUser;
        }
        return user;
    }

    /**
     * Find an item
     * If a hidden item is requested, provide authHeader!
     * This method does not return any HTTP response, as the response depends on the type of request
     * @param {Int32Array} itemID ID of item to find
     * @param {String} authHeader Current client data (needed if hidden item is requested)
     * @returns The found item. If no item is found, returns false.
     */
    static findItemData(itemID, authHeader){
        const item = items.find(i => i.itemID === parseInt(itemID));
        if (!item) return false;
        let itemBids = bids.filter(b => b.itemID === parseInt(item.itemID));
        
        //Bid validation
        if (itemBids.length >= 1) {
            item.bidCount = itemBids.length;
            item.latestBid = itemBids[itemBids.length-1].price;
        }

        if (new Date(item.auctionEndTime).getTime() <= Date.now() && !item.isSold) {
            item.isSold = true;
            if (itemBids.length !== 0) item.buyer=itemBids[itemBids.length-1].bidder;
            else item.buyer = null;
        }
        if (!item.isPublic){
            const lookupUser = authCheck(authHeader);
            if (!lookupUser || (item.sellerID !== lookupUser.username && !lookupUser.isAdmin)){return false;}
        }
        return item;
    }

}

module.exports = Lookups;