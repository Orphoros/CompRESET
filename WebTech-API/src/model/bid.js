class Bid {
    /**
     * Make a new bid
     * @param {Int32Array} bidID ID of the new bid
     * @param {Int32Array} itemID ID of the item to which the bid belongs
     * @param {String} bidder Username of the one who made the bid
     * @param {Int32Array} price Value in euros
     */
    constructor(bidID, itemID, bidder, price){
        this.bidID = bidID;
        this.itemID = itemID;
        this.bidder = bidder;
        this.price = price;
    }

    /**
     * Convert the bid object to JSON string
     * @returns JSON String of the bid
     */
    toJSON(){
        return ({
            'bidID': this.bidID,
            'itemID': this.itemID,
            'bidder': this.bidder,
            'price': this.price
        });
    }
}
module.exports = Bid;