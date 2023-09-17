class InventoryDTO {
	constructor(warehouseReturn, inventoryReturn, productReturn) {
		this.warehouseData = warehouseReturn;
		this.inventoryData = inventoryReturn;
		this.productData = productReturn;
	}

	outputData() {
		const inventoryByWarehouse = new Map();

		this.warehouseData.forEach((warehouse) => {
			inventoryByWarehouse.set(warehouse.id, {
				id: warehouse.id,
				name: warehouse.name,
				address: warehouse.address,
				fillVolume: warehouse.fillVolume,
				volume: warehouse.volume,
				inventory: [],
			});
		});

		this.inventoryData.forEach((inventoryItem) => {
			const { warehouseId, productId, quantity } = inventoryItem;

			if (inventoryByWarehouse.has(warehouseId)) {
				const productDetails = this.getProductDetails(productId);
				if (productDetails) {
					inventoryByWarehouse.get(warehouseId).inventory.push({
						productId,
						productName: productDetails.name,
						productBrand: productDetails.brand,
						category: productDetails.category.name,
						size: productDetails.dimension,
						color: productDetails.color,
						quantity,
					});
				}
			}
		});
		return Array.from(inventoryByWarehouse.values());
	}

	getProductDetails(productId) {
		return this.productData.find((product) => {
			return product._id.toString() === productId;
		});
	}
}

module.exports = { InventoryDTO };
