class ECOMProdList {
	constructor(arrayList) {
		this.array = [];
		for (const item of arrayList) {
			this.array.push({
				image: '/Banana-Single.jpg',
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
		this.image = '/Banana-Single.jpg';
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

class CartProd {
	constructor(mongoReturn, mysqlReturn) {
		this.array = mongoReturn.map((mongoProduct) => {
			const id = mongoProduct._id.toString();
			const matchMysqlProduct = mysqlReturn.find(
				(mysqlProduct) => mysqlProduct.productId === id
			);
			if (matchMysqlProduct) {
				return {
					image: '/Banana-Single.jpg',
					id: id,
					name: mongoProduct.name,
					category: mongoProduct.category.name,
					price: mongoProduct.price,
					quantity: matchMysqlProduct.quantity,
				};
			}
		});
	}

	getCart() {
		return this.array;
	}
}

class Category {
	constructor(categories) {
		this.categories = categories;
	}

	generateOutput() {
		const topLevelCategories = this.categories.filter(
			(category) => !category.parentCate
		);
		const output = topLevelCategories.map((category) => {
			return {
				id: category._id.toString(),
				name: category.name,
				childCategory: this.getChildCategories(category._id),
			};
		});
		return output;
	}

	// Helper method to get child categories recursively
	getChildCategories(parentId) {
		const childCategories = this.categories.filter(
			(category) =>
				category.parentCate && category.parentCate._id.equals(parentId)
		);

		const childCategoryOutput = childCategories.map((childCategory) => {
			return {
				id: childCategory._id.toString(),
				name: childCategory.name,
				childCategory: [],
			};
		});
		return childCategoryOutput;
	}
}

module.exports = {
	ECOMProdList: ECOMProdList,
	ProductDetail: ECOMProdDetail,
	CartProduct: CartProd,
	CategoryDTO: Category,
};
