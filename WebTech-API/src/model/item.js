class Item {
    constructor(itemID, sellerID, name, description, manufacturingYear, cpu, maxRAM, expansionSlots, itemCondition, auctionEndTime, minBid){
        this.itemID = itemID;
        this.isPublic = false;
        this.isSold = false;
        this.sellerID = sellerID;
        this.name = name;
        this.description = description;
        this.manufacturingYear = manufacturingYear;
        this.cpu = cpu;
        this.maxRAM = maxRAM;
        this.expansionSlots = expansionSlots;
        this.itemCondition= itemCondition;
        this.auctionEndTime = auctionEndTime;
        this.bidCount = 0;
        this.minBid = minBid;
        this.latestBid = minBid;
        this.buyer = undefined;
    }

    /**
     * Converts the Item object to JSON
     * @returns JSON String of the item object
     */
    toJSON() {
        return ({
            "itemID": this.itemID,
            "isPublic": this.isPublic,
            "isSold": this.isSold,
            "sellerID": this.sellerID,
            "name": this.name,
            "description": this.description,
            "manufacturingYear": this.manufacturingYear,
            "cpu": this.cpu,
            "maxRAM": this.maxRAM,
            "expansionSlots": this.expansionSlots,
            "itemCondition": this.itemCondition,
            "auctionEndTime": this.auctionEndTime,
            "buyer": this.buyer,
            "minBid": this.minBid,
            "latestBid": this.latestBid,
            "bidCount": this.bidCount
        });
    }
}

class Cpu {
    static cpuList = [
        new Cpu('Intel x86'),
        new Cpu('Intel x64'),
        new Cpu('Intel x86-16'),
        new Cpu('Intel (other)'),
        new Cpu('AMD x86'),
        new Cpu('AMD x64'),
        new Cpu('AMD (other)'),
        new Cpu('AMD x86'),
        new Cpu('ARM x86'),
        new Cpu('ARM x64'),
        new Cpu('Cyrix x86'),
        new Cpu('MIPS x64'),
        new Cpu('MIPS x86'),
        new Cpu('Zilog'),
        new Cpu('Other')
    ];

    constructor(name) {
        this.name = name;
    }

    /**
     * Converts the CPU object to JSON
     * @returns JSON String of the CPU object
     */
    toString(){return this.name;}
}

class Condition {
    static conditionList = [
        new Condition("Brand new"),
        new Condition("Used - Like new"),
        new Condition("Used")
    ];

    constructor(name) {
        this.name = name;
    }

    /**
     * Converts the Condition object to JSON
     * @returns JSON String of the Condition object
     */
    toString(){return this.name;}
}

module.exports = {Item,Cpu,Condition};