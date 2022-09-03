const express = require('express');
const cors = require('cors');
const httpError = require('../model/httpError');
const itemData = require('./data/itemData');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.use('/api/v1/bids', require('./routes/bidsRouter'));
app.use('/api/v1/users', require('./routes/usersRouter'));
app.use('/api/v1/items', require('./routes/itemsRouter'));

/**
 * Fallback
 */
app.all('*', (req, res) => {
    new httpError(req, res, 404, `Cannot ${req.method} ${req.path}`);
});

/**
 * Only for running tests
 */
app.listen(port, () => {
    itemData[0].isPublic = true;
    itemData[1].isPublic = true;
});