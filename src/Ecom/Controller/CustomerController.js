const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { GetProdListService } = require('../Service/EcomService');
const port = 5501;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`App listening  on port ${port}`);
});

app.use('/', express.static(__dirname + 'index.html'));

app.post('/detailed_item', (req, res) => {
    res.redirect(
        url.format({
            pathname: __dirname + 'product_detail.html',
            query: req.query,
        })
    );
});

app.post('/display_item', (req, res) => {
    const item = [
        {
            image: 'Banana-Single.jpg',
            name: 'Egg',
            brand: 'Kosher',
            price: 90,
            source: 'Warehouse A',
            item_category: 'Food',
        },

        {
            image: 'Banana-Single.jpg',
            name: 'Mouse',
            brand: 'Razer',
            price: 180,
            source: 'Warehouse B',
            item_category: 'Electronic',
        },
    ];

    res.send(item);
});
