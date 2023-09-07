const {
	insertWarehouseService,
	insertCategoryService,
	insertProductService,
	createPO,
} = require('../WMS/Service/WMSService');

const getMySqlConn = require('../config/sql/Connector');

let fs = require('fs');
let readline = require('readline');

let warehouses = [];
let products = [];
let categories = [];
let POStatus = [];

Promise.resolve()
	.then(async () => {
		let myCon = await getMySqlConn('root');
		let rl = await readline.createInterface({
			input: fs.createReadStream('../config/sql/asm3.sql'),
			terminal: false,
		});

		await rl.on('line', function (chunk) {
			myCon.query(chunk.toString('ascii'), function (err, sets, fields) {
				if (err) {
					console.log(err);
				}
			});
		});
		await rl.on('close', function () {
			console.log('finished');
			myCon.end();
		});
	})
	// Insert Warehouse
	.then(async () => {
		const result = await insertWarehouseService('whadmin', {
			name: 'test warehouse 1',
			address: '123 test address',
			city: 'test city',
			province: 'test province',
			volume: 5000,
		});

		warehouses.push(result.message);
	})
	.then(async () => {
		const result = await insertWarehouseService('whadmin', {
			name: 'test warehouse 2',
			address: '456 test address',
			city: 'test city 2',
			province: 'test province 2',
			volume: 3000,
		});
		warehouses.push(result.message);
	})
	.then(async () => {
		const result = await insertWarehouseService('whadmin', {
			name: 'test warehouse 3',
			address: '789 test address',
			city: 'test city 3',
			province: 'test province 3',
			volume: 2000,
		});
		warehouses.push(result.message);
	})
	.then(() => console.log(warehouses))
	.then(async () => {
		const result = await insertCategoryService('whadmin', {
			name: 'test cate 1',
			parentId: null,
			attribute: [{ name: 'attribute 1' }],
		});
		categories.push(result.message.toString());
	})
	.then(async () => {
		const result = await insertCategoryService('whadmin', {
			name: 'test cate 2',
			parentId: null,
			attribute: [{ name: 'attribute 2' }, { name: 'attribute 3' }],
		});
		categories.push(result.message.toString());
	})
	.then(async () => {
		const result = await insertCategoryService('whadmin', {
			name: 'test cate 3',
			parentId: categories[0],
			attribute: [{ name: 'attribute 2' }],
		});
		categories.push(result.message.toString());
	})
	.then(() => console.log(categories))
	.then(async () => {
		const result = await insertProductService('whadmin', {
			name: 'test product name 1',
			brand: 'test brand 1',
			price: 18000,
			dimension: { width: 2, height: 1, length: 3 },
			color: 'red',
			category: categories[1],
			attribute: [
				{
					name: 'attribute 2',
					value: 'test attribute 2 value',
				},
				{ name: 'attribute 3', value: 'test attribute 3 value' },
			],
			pAttribute: null,
		});
		products.push(result.message);
	})
	.then(async () => {
		const result = await insertProductService('whadmin', {
			name: 'test product name 2',
			brand: 'test brand 2',
			price: 35000,
			dimension: { width: 1, height: 2, length: 1 },
			color: 'blue',
			category: categories[2],
			attribute: [
				{
					name: 'attribute 2',
					value: 'test attribute 2 value',
				},
			],
			pAttribute: [
				{ name: 'attribute 1', value: 'test attribute 1 value' },
			],
		});
		products.push(result.message);
	})
	.then(() => console.log(products))
	.then(async () => {
		const result = await createPO('whadmin', {
			id: products[0],
			qty: 100,
		});
		POStatus.push(result.message);
	})
	.then(async () => {
		const result = await createPO('whadmin', {
			id: products[1],
			qty: 200,
		});
		POStatus.push(result.message);
	});
// Insert category

// Insert product

//update product inventory
