const express = require('express');

const { getAvailableProductService } = require('../Service/EcomService');

const app = express();
const port = 5501;

app.use(express.static('views'));

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render('index', { title: 'ecom home' });
});
app.get('/display_item', async (req, res) => {
	try {
		const response = await getAvailableProductService();
		if (!response.err) {
			res.status(200).send(response.message);
		} else {
			res.status(500).json({ error: response.message });
		}
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.post('/productDetail', async (req, res) => {
	//call service get detail info of product with id = req.body.productId
	res.status(200).send({ message: 'product page go here' });
});

app.listen(port, () => {
	console.log(`App listening  on port ${port}`);
});

// const item = [
//     {
//         image: 'Banana-Single.jpg',
//         name: 'Egg',
//         brand: 'Kosher',
//         price: 90,
//         source: 'Warehouse A',
//         item_category: 'Food',
//     },
//
//     {
//         image: 'Banana-Single.jpg',
//         name: 'Mouse',
//         brand: 'Razer',
//         price: 180,
//         source: 'Warehouse B',
//         item_category: 'Electronic',
//     },
// ];
//
