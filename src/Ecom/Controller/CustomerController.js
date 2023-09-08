const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const { getAvailableProductService } = require('../Service/EcomService');
const { title } = require('process');

const app = express();
const port = 5501;

var clickedItem = null;

app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('index.ejs', { title: 'ecom home' });
});

app.get('/index', (req, res) =>{
    res.render('index', {title: 'EcomHome'})
})

app.get('/product_detail', (req, res) =>{
    res.render('product_detail', {title: 'EcomHome'})
})

app.get('/display_item', async (req, res) => {
    try {
        // let response = await getAvailableProductService();
        let response = {err: false, message: item}
        if (!response.err) res.status(200).send(response.message);
        else res.status(500).json({ error: response.message });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/retreive_detail', async (req,res) =>{
    try{
        console.log(clickedItem)
        let response = {err: false, message: item_detail}
        if (!response.err) res.status(200).send(response.message);
        else res.status(500).json({ error: response.message });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})


app.post('/productDetail', async (req, res) => {
    //call service get detail info of product with id = req.body.productId
    // console.log(typeof(req.body.productId))
    // res.send(JSON.parse(req.body.productId))
    // console.log((req.body))
    // res.status(200).send(req.body);

    clickedItem = req.body
    // res.redirect('localhost:5501/product_detail')
    res.send("200")
});

app.listen(port, () => {
    console.log(`App listening  on port ${port}`);
});

const item = [
    {
        image: 'Banana-Single.jpg',
        name: 'Egg',
        brand: 'Kosher',
        price: 90,
        source: 'Warehouse A',
        item_category: 'Food',
        id: 'idk'
    },

    {
        image: 'Banana-Single.jpg',
        name: 'Mouse',
        brand: 'Razer',
        price: 180,
        source: 'Warehouse B',
        item_category: 'Electronic',
    },
  
    {
        image: "Banana-Single.jpg",
        name: "Phone",
        brand: "Iphone",
        price: 500,
        source: "Warehouse B",
        item_category: "Electronic",
        id: 3
    }
];

const item_detail = {
    id: 2,
    image: "Banana-Single.jpg",
    name: "Mouse",
    brand: "Razer",
    price: "180",
    color: "Black",
    dimension: "100 x 90 x 80",
    category: "Mouse",
    attribute: "Wireless",
    pAttribute: "Electronic",
    inventory: 1000,
}