const Bid = require('../../model/bid');

const bids = [
    new Bid(1,2355, 'a',100),
    new Bid(2,2355, 'b',200),
    new Bid(3,2355, 'b',300),
    new Bid(4,8542, 'b',400),
    new Bid(5,8542, 'c',500),
    new Bid(6,9933, 'c',900) //  <- This is for a hidden item (owned by 'b')
];

module.exports = bids;