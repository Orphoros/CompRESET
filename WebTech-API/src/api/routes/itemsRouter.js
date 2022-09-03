const router = require('express').Router();
const httpError = require('../../model/httpError');
const bids = require('../data/bidData');
const items = require('../data/itemData');
const {isAuthenticated} = require('../middleware/isAuthenticated');
const {isXSSsafe} = require('../middleware/isXSSsafe');
const {findItem} = require('../middleware/findItem');
const {findItemData} = require ('../../helpers/lookups');
const Bid = require('../../model/bid');
const {Cpu, Item, Condition} = require('../../model/item');
const {deleteItem} = require('../../helpers/erasers');

//===========================[ GET REQUESTS ]===========================\\

//Get all enum filters
router.get('/data-presets', function (req,res){
    let dataObj = {
        'cpus': Cpu.cpuList,
        'conditions': Condition.conditionList
    };
    res.send(dataObj);
});

// Get a specific item
router.get('/:itemID', isXSSsafe, findItem, function (req,res) {
    const item = req.item;
    res.send(item);
});

//Get all bids for an item
router.get('/:itemID/bids', isXSSsafe, findItem, function (req,res) {
    const item = req.item;
    const bid = bids.filter(b => b.itemID === item.itemID);
    res.send(bid);
});

//Get all items
router.get('',isXSSsafe,function (req,res){
    const filters = req.query;

    //Delete parameters on which we do not allow to filter
    delete req.query.itemID;
    delete req.query.isPublic;
    delete req.query.minBid;

    if (req.query.isSold !== undefined) req.query.isSold = (req.query.isSold === 'true');
    if (req.query.name) req.query.name = req.query.name.toLocaleLowerCase();
    const filteredItems = items.filter(item => {
        let isValid = true;
        for (let key in filters) {
            if (key === 'name') isValid = isValid && item[key].toLocaleLowerCase().includes(filters[key]);
            else isValid = isValid && item[key] == filters[key];
        }
        if (isValid && !item.isPublic){
            isValid = findItemData(item.itemID, req.headers['authorization']);
        }
        return isValid;
    });
    res.send(filteredItems);
});
//===========================[ POST REQUESTS ]===========================\\

//Add a new item
router.post('',isXSSsafe,isAuthenticated,function (req,res){
    if (!req.body
        || !req.body.name
        || !req.body.description
        || !req.body.manufacturingYear
        || !req.body.cpu
        || !req.body.maxRAM
        || !req.body.expansionSlots
        || !req.body.itemCondition
        || !req.body.auctionEndTime
        || !req.body.minBid) {return new httpError(req,res,400,'Incomplete request structure');}
    const creator = req.user;
    let cpu;
    Cpu.cpuList.forEach((item) => {
        if(item.toString() === req.body.cpu) cpu = item.toString();
    });
    if (!cpu){return  new httpError(req,res,400,'Invalid CPU field');}
    let randomized = -1;
    while (randomized === -1){
        let testNum = Math.floor(Math.random() * 10000000)+1;
        if(!items.find(i => i.itemID === testNum)){randomized = testNum;}
    }
    const item = new Item(
        randomized,
        creator.username,
        req.body.name,
        req.body.description,
        req.body.manufacturingYear,
        cpu,
        req.body.maxRAM,
        req.body.expansionSlots,
        req.body.itemCondition,
        req.body.auctionEndTime,
        req.body.minBid
    );
    items.push(item);
    res.status(201).send(item);
});

/**
 * Add a new bid to an existing item
 */
router.post('/:itemID/bids',isXSSsafe,isAuthenticated,findItem,function (req,res) {
    if (!req.body.price) {return new httpError(req, res, 400, 'Incomplete request structure');}
    if (req.body.price <= req.item.latestBid) {return new httpError(req, res, 400, 'New bid is less than or equal to last bid. Please bid higher');}
    req.params.itemID = parseInt(req.params.itemID);
    const creator = req.user.username;
    let randomized = -1;
    while (randomized === -1){
        let testNum = Math.floor(Math.random() * 10000000)+1;
        if(!bids.find(b => b.bidID === testNum)){randomized = testNum;}
    }
    const bid = new Bid(randomized,req.params.itemID,creator,req.body.price);
    bids.push(bid);
    items[items.indexOf(req.item)].latestBid = req.body.price;
    items[items.indexOf(req.item)].bidCount = items[items.indexOf(req.item)].bidCount+1;
    res.status(201).send(bid.toJSON());
});

//===========================[ PATCH REQUESTS ]===========================\\

router.patch('/:itemID',isXSSsafe, isAuthenticated, findItem, function (req,res){
    if (!req.params.itemID || !req.body){return new httpError(req,res,400,'Incomplete request structure');}
    let item = req.item;
    if (req.user.username !== item.sellerID && !req.user.isAdmin){return new httpError(req,res,403,`The user ${req.user.name} is not the seller of the item with ID ${req.params.itemID} or an administrator`);}
    if (item.isSold){return new httpError(req,res,405,`The item with ID ${req.params.itemID} has been sold. Cannot edit sold items!`);}
    const itemIndex = items.indexOf(item);

    if(req.body.isPublic !== undefined) items[itemIndex].isPublic = req.body.isPublic;
    if(req.body.name) items[itemIndex].name = req.body.name;
    if(req.body.description) items[itemIndex].description = req.body.description;
    if(req.body.manufacturingYear) items[itemIndex].manufacturingYear = req.body.manufacturingYear;
    if(req.body.cpu){
        let cpu;
        Cpu.cpuList.forEach((item) => {
            if(item.toString() === req.body.cpu) cpu = item.toString();
        });
        if (!cpu){return  new httpError(req,res,400,'Invalid CPU field');}
        items[itemIndex].cpu = cpu;
    }
    if(req.body.maxRAM) items[itemIndex].maxRAM = req.body.maxRAM;
    if(req.body.expansionSlots) items[itemIndex].expansionSlots = req.body.expansionSlots;
    if(req.body.itemCondition) items[itemIndex].itemCondition = req.body.itemCondition;

    res.status(200).send(item);
});

//===========================[ DELETE REQUESTS ]===========================\\

//Delete an item by ID
router.delete('/:itemID',isXSSsafe, isAuthenticated, findItem, function(req,res){
    if (!req.params.itemID){return new httpError(req,res,400,'Incomplete request structure');}
    let item = req.item;
    if (req.user.username !== item.sellerID && !req.user.isAdmin){return new httpError(req,res,403,`The user ${req.user.name} is not the seller of the item with ID ${req.params.itemID} or an administrator`);}

    deleteItem(item);

    res.status(204).send(undefined);
});

/**
 * Fallback
 */
router.all('*', (req, res) => {
    new httpError(req, res, 405, `Method ${req.method} is not allowed on ${req.baseUrl}${req.path}`);
});

module.exports = router;