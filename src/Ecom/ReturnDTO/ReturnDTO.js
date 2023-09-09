const { mongo } = require('mongoose');

class ECOMProdList {
	constructor(arrayList) {
		this.array = [];
		for (const item of arrayList) {
			this.array.push({
				image: 'Banana-Single.jpg',
				id: item._id.toString(),
				name: item.name,
				brand: item.brand,
				price: item.price,
				category: item.category.name,
				parentCate: (() => {
					if (item.category.parentCate != null) {
						return item.category.parentCate.name;
					} else {
						return null;
					}
				})(),
			});
		}
	}

	getList() {
		return this.array;
	}
}

class ECOMProdDetail {
	constructor(mongoReturn, mysqlReturn) {
		this.id = mongoReturn._id.toString();
		this.name = mongoReturn.name;
		this.brand = mongoReturn.brand;
		this.price = mongoReturn.price;
		this.color = mongoReturn.color;
		this.dimension = mongoReturn.dimension;
		this.category = mongoReturn.category;
		this.attribute = mongoReturn.attribute;
		this.pAttribute = mongoReturn.pAttribute;
		this.inventory = mysqlReturn.inventory;
		this.image = 'Banana-Single.jpg';
	}

	getProductDetail() {
		return {
			id: this.id,
			name: this.name,
			brand: this.brand,
			price: this.price,
			color: this.color,
			dimension: this.dimension,
			category: this.category,
			attribute: this.attribute,
			pAttribute: this.pAttribute,
			inventory: this.inventory,
			image: this.image,
		};
	}
}

module.exports = { ECOMProdList: ECOMProdList, ProductDetail: ECOMProdDetail };
