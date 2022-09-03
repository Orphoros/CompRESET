const router = require('express').Router();
const {users, invalidTokens} = require('../data/userData');
const httpError = require('../../model/httpError');
const jwt = require('jsonwebtoken');
const {v4:uuidv4} = require('uuid');
const bids = require('../data/bidData');
const items = require('../data/itemData');
const User = require('../../model/user');
const security = require('../../helpers/security');
const {findUser, findItemData: findItem} = require('../../helpers/lookups');
const {isAuthenticated} = require('../middleware/isAuthenticated');
const {isXSSsafe} = require('../middleware/isXSSsafe');
const { deleteUser } = require('../../helpers/erasers');

//===========================[ GET REQUESTS ]===========================\\

//Get one user
router.get('/:username',isXSSsafe, function (req,res) {
    const user = users.find(u => u.username === req.params.username);
    if (!user) return new httpError(req, res, 404, `The user with username ${req.params.username} could not be found!`);
    res.send(user.toJSON());
});

//Get user bids
router.get('/:username/bids',isXSSsafe, function (req,res) {
    const user = users.find(u => u.username === req.params.username);
    if (!user) return new httpError(req, res, 404, `The user with username "${req.params.username}" could not be found!`);
    const filteredBids = bids.filter(b => b.bidder === user.username);
    filteredBids.forEach((b) => {
        if (!findItem(b.itemID, req.headers['authorization'])){filteredBids.splice(filteredBids.indexOf(b,1));}
    });
    if (!filteredBids[0]) return res.status(200).send([]);
    if (req.query.itemID){
        const filterItem = findItem(req.query.itemID, req.headers['authorization']);
        if (!filterItem){return res.status(200).send([]);}
        const bidItems = filteredBids.filter(b => b.item === filterItem);
        if (bidItems[0]) res.send(bidItems);
    }
    res.send(filteredBids);
});

//Get user items
router.get('/:username/items',isXSSsafe, function (req,res) {
    const user = users.find(u => u.username === req.params.username);
    if (!user) return new httpError(req, res, 404, `The user with username ${req.params.username} could not be found!`);
    const itemArr = items.filter(i => i.sellerID === user.username);
    itemArr.forEach((i) => {
        if (!findItem(i.itemID, req.headers['authorization'])){itemArr.splice(itemArr.indexOf(i,1));}
    });
    if (!itemArr[0]) return res.status(200).send([]);
    res.send(itemArr);
});

//===========================[ POST REQUESTS ]===========================\\

//Register user
router.post('',isXSSsafe, function (req,res){
    if (!req.body || !req.body.email || !req.body.username || !req.body.password){return new httpError(req,res,400, 'Incomplete request structure');}
    if(req.body.username === '' || req.body.username.includes(' ') || req.body.username.includes('/') || req.body.username.includes('\\')) return new httpError(req,res,400, 'Username contains invalid characters! No spaces and slashes are allowed!');
    const foundUser = findUser(req,res,true, false);
    if(foundUser){return foundUser;}
    const password = security.getHash(req.body.password);
    users.push(new User(req.body.email,req.body.username,password,uuidv4(),false));
    res.status(201).send(findUser(req,res,false, false).toJSON());
});

//Log user in
router.post('/login',isXSSsafe, function (req,res){
    if (!req.body || !req.body.email || !req.body.password){return new httpError(req,res,400,'Incomplete request structure');}
    const foundUser = findUser(req,res,false,false);
    if(!(foundUser instanceof User)){return foundUser;}
    if(security.checkHash(foundUser.hashedPsswd, req.body.password)){
        res.send({token : jwt.sign(foundUser.toJSON(),foundUser.secret,{expiresIn: '7d'})});
    }
    else{return new httpError(req,res,400,`User with email address ${req.body.email} does not exist or password is incorrect`);}
});

//Log user out
router.post('/logout',isAuthenticated,function (req,res){
    invalidTokens.push(req.headers['authorization']);
    res.status(204).send(undefined);
});

//===========================[ PATCH REQUESTS ]===========================\\

router.patch('/:username',isXSSsafe,isAuthenticated, function (req,res){
    if (!req.body) return new httpError(req,res,400, 'Incomplete request structure');
    if(req.user.username !== req.params.username) return new httpError(req,res,403,'The data of the currently logged in user does not match the data of the user you want to change!');
    const userConflict = findUser(req,res,false,true);
    if (!(userConflict instanceof User)){return userConflict;}
    let targetUser = users[users.indexOf(req.user)];
    if (req.body.email) targetUser.email = req.body.email;
    if (req.body.password) targetUser.hashedPsswd = security.getHash(req.body.password);

    res.status(200).send(targetUser.toJSON());
});

//===========================[ DELETE REQUESTS ]===========================\\

//Delete a user by username
router.delete('/:username',isXSSsafe, isAuthenticated, function(req,res){
    if (req.user.username !== req.params.username && !req.user.isAdmin) return new httpError(req,res,403,'The data of the currently logged in user does not match the data of the user you want to change!');

    deleteUser(req.params.username);
    res.status(204).send(undefined);
});

/**
 * Fallback
 */
router.all('*', (req, res) => {
    new httpError(req, res, 405, `Method ${req.method} is not allowed on ${req.baseUrl}${req.path}`);
});

module.exports = router;