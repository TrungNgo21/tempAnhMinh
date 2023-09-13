const warehouseData = [
	{
		name: 'Warehouse A',
		address: '123 Main Street',
		city: 'Los Angeles',
		province: 'California',
		volume: 5000,
	},
	{
		name: 'Warehouse B',
		address: '456 Elm Street',
		city: 'New York',
		province: 'New York',
		volume: 3000,
	},
	{
		name: 'Warehouse C',
		address: '789 Oak Street',
		city: 'Chicago',
		province: 'Illinois',
		volume: 2000,
	},
	{
		name: 'Warehouse D',
		address: '101 Pine Street',
		city: 'San Francisco',
		province: 'California',
		volume: 4000,
	},
	{
		name: 'Warehouse E',
		address: '222 Chestnut Avenue',
		city: 'Miami',
		province: 'Florida',
		volume: 3500,
	},
	{
		name: 'Warehouse F',
		address: '555 Maple Drive',
		city: 'Dallas',
		province: 'Texas',
		volume: 2500,
	},
	{
		name: 'Warehouse G',
		address: '777 Birch Lane',
		city: 'Boston',
		province: 'Massachusetts',
		volume: 3200,
	},
	{
		name: 'Warehouse H',
		address: '888 Cedar Road',
		city: 'Seattle',
		province: 'Washington',
		volume: 2800,
	},
	{
		name: 'Warehouse I',
		address: '999 Willow Street',
		city: 'Phoenix',
		province: 'Arizona',
		volume: 4200,
	},
	{
		name: 'Warehouse J',
		address: '333 Oakwood Drive',
		city: 'Denver',
		province: 'Colorado',
		volume: 3800,
	},
];

const categoryData = [
	{
		name: 'Electronics',
		parentId: null,
		attributes: [{ name: 'Type' }, { name: 'Department' }],
	},
	{
		name: 'Clothing',
		parentId: null,
		attributes: [{ name: 'Type' }, { name: 'Style' }, { name: 'Size' }],
	},
	{
		name: 'Furniture',
		parentId: null,
		attributes: [{ name: 'Type' }, { name: 'Material' }, { name: 'Size' }],
	},
	{
		name: 'Groceries',
		parentId: null,
		attributes: [{ name: 'Type' }, { name: 'Weight' }],
	},
	{
		name: 'Toys',
		parentId: null,
		attributes: [{ name: 'Type' }, { name: 'Age Group' }],
	},
	{
		name: 'Sports Equipment',
		parentId: null,
		attributes: [{ name: 'Type' }, { name: 'Sport' }, { name: 'Size' }],
	},
	{
		name: 'Books',
		parentId: null,
		attributes: [
			{ name: 'Type' },
			{ name: 'Genre' },
			{ name: 'Author' },
			{ name: 'Language' },
		],
	},
	{
		name: 'Home Appliances',
		parentId: null,
		attributes: [{ name: 'Type' }, { name: 'Power' }],
	},
	{
		name: 'Beauty Products',
		parentId: null,
		attributes: [{ name: 'Type' }, { name: 'Volume' }],
	},
	{
		name: 'Automotive Parts',
		parentId: null,
		attributes: [{ name: 'Type' }, { name: 'Material' }],
	},
	{
		name: 'Kitchen Appliances',
		parentId: 'Home Appliances',
		attributes: [{ name: 'Capacity' }, { name: 'Color Options' }],
	},
	{
		name: 'Laptops',
		parentId: 'Electronics',
		attributes: [{ name: 'Processor Type' }, { name: 'Screen Size' }],
	},
	{
		name: 'Outdoor Gear',
		parentId: 'Sports Equipment',
		attributes: [{ name: 'Material' }, { name: 'Weight' }],
	},
	{
		name: "Children's Books",
		parentId: 'Books',
		attributes: [{ name: 'Illustrations' }, { name: 'Reading Level' }],
	},
	{
		name: 'Personal Care',
		parentId: 'Beauty Products',
		attributes: [{ name: 'Skin Type' }, { name: 'Fragrance' }],
	},
];
