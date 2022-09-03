const router = require('express').Router();
const bids = require('../data/bidData');
const httpError = require('../../model/httpError');
const {isAuthenticated} = require('../middleware/isAuthenticated');
const {isXSSsafe} = require('../middleware/isXSSsafe');
const {findItemData} = require ('../../helpers/lookups');
const {deleteBid} = require('../../helpers/erasers');

//===========================[ GET REQUESTS ]===========================\\
 
//Get a specific bid
router.get('/:id', isXSSsafe, function (req,res) {
    const bid = bids.find(b => b.bidID === parseInt(req.params.id));
    if (!bid) return new httpError(req, res, 404, `Bid under the ID ${req.params.id} could not be found!`);
    const item = findItemData(bid.itemID, req.headers['authorization']);
    if (!item) return new httpError(req, res, 404, `Bid under the ID ${req.params.id} could not be found!`);
    res.send(bid);
});

//===========================[ DELETE REQUESTS ]===========================\\

//Delete a bid by ID
router.delete('/:id',isXSSsafe, isAuthenticated, function (req,res) {
    const bid = bids.find(b => b.bidID === parseInt(req.params.id));
    if (!bid) return new httpError(req, res, 404, `Bid under the ID ${req.params.id} could not be found!`);
    if (bid.bidder !== req.user.username && !req.user.isAdmin) return new httpError(req,res,403,`The user ${req.user.name} is not the bidder on bid with ID ${req.params.itemID} or an administrator`);
    
    deleteBid(bid);

    res.status(204).send(undefined);
});

/**
 * Fallback
 */
router.all('*', (req, res) => {
    new httpError(req, res, 405, `Method ${req.method} is not allowed on ${req.baseUrl}${req.path}`);
});

module.exports = router;