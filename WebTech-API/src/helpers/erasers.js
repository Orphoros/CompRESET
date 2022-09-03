const items = require('../api/data/itemData');
const bids = require('../api/data/bidData');
const {users} = require('../api/data/userData');

/**
 * Class that cascades items/bids/users on deletion
 */
class Erasers {
    /**
     * Deletes an item and all bids placed on that item
     * @param {Object} item Item to delete
     */
    static deleteItem(item){
        let itemBids = bids.filter(b => b.itemID === item.itemID);
        if (itemBids.length > 0) itemBids.forEach(bid => Erasers.deleteBid(bid));
        items.splice(items.indexOf(item),1);
    }

    /**
     * Deletes a bid
     * If the latest bid has been deleted, resets the current price to the biggest bid
     * If the last bid has been deleted, resets the current price to the minimum bid
     * @param {Object} bid Bid to delete
     */
    static deleteBid(bid){
        let itemIndex = items.indexOf(items.find(i => i.itemID === bid.itemID));
        let itemBids = bids.filter(b => b.itemID === bid.itemID);
        if (bid.price === items[itemIndex].latestBid) {
            if (itemBids[itemBids.indexOf(bid)-1]) items[itemIndex].latestBid = itemBids[itemBids.indexOf(bid)-1].price;
            else items[itemIndex].latestBid = items[itemIndex].minBid;
        }
        items[itemIndex].bidCount -= 1; 
        bids.splice(bids.indexOf(bid),1);
    }

    /**
     * Deletes a user
     * This function will also delete all items the user is selling and all bids placed by the user
     * @param {Object} userID ID of user to delte
     */
    static deleteUser(userID){
        let userSellerItems = items.filter(i => i.sellerID === userID);
        if (userSellerItems.length > 0) userSellerItems.forEach(item => Erasers.deleteItem(item));
        let userBids = bids.filter(b => b.bidder === userID);
        if (userBids.length > 0) userBids.forEach(bid => Erasers.deleteBid(bid));
        let userWonItems = items.filter(i => i.buyer === userID);
        if (userWonItems.length > 0) userWonItems.forEach(item => {item.buyer='[DELETED USER]';});
        users.splice(users.indexOf(userID),1);
    }
}

module.exports = Erasers;