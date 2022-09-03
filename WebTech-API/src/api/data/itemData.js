const Item = require('../../model/item').Item;

const items = [
    new Item(
        2355,
        'a',
        'ZX Spectrum - Brand new, in-box',
        'A brand new, old-stock, ZX spectrum. Still in its original box',
        1983,
        'Zilog',
        16,
        1,
        'Brand new',
        new Date('2021-11-20T00:13:37.000Z').toJSON(),
        50
    ),
    new Item(
        8542,
        'b',
        'Hewlett Packard N3541',
        'Slightly used and well looked after. Has an ATI Rage Pro installed. Confirmed working',
        1998,
        'Intel x86',
        524288,
        3,
        'Used - Like new',
        new Date('2021-11-20T00:13:37.000Z').toJSON(),
        40
    ),
    new Item(
        9933,
        'a',
        'Unlisted laptop',
        'A mysterious, hidden laptop',
        2000,
        'AMD (other)',
        524288,
        6,
        'Used - Like new',
        new Date('2021-11-20T00:13:37.000Z').toJSON(),
        60
    )
];

module.exports = items;