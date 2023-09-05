const { ObjectId } = require('mongodb');

class UpdateInventoryDTO {
    constructor(id, qty) {
        this.id = id;
        this.qty = qty;
    }

    getId() {
        return this.id;
    }

    getQty() {
        return this.qty;
    }
}
class TransferDTO {
    constructor(id, fromWh, toWh, qty) {
        this.id = id;
        this.fromWh = fromWh;
        this.toWh = toWh;
        this.qty = qty;
    }

    getId() {
        return this.id;
    }

    getFromWh() {
        return this.fromWh;
    }

    getToWh() {
        return this.toWh;
    }

    getQty() {
        return this.qty;
    }
}
class MySqlUpdateProductDTO {
    constructor(id, volume) {
        this.id = id;
        this.volume = volume;
    }

    getId() {
        return this.id;
    }

    getVolume() {
        return this.volume;
    }
}
class MongoProductDTO {
    constructor(name, brand, price, dimension, color, category, attribute, parentAttribute) {
        this.name = name;
        this.brand = brand;
        this.price = price;
        this.dimension = { width: dimension.width, height: dimension.height, length: dimension.length };
        this.color = color;
        this.category = new ObjectId(category);
        this.attribute = new Map(attribute.map((element) => [element.name, element.value]));
        this.parentAttribute = new Map(parentAttribute.map((element) => [element.name, element.value]));
    }

    getName() {
        return this.name;
    }

    getBrand() {
        return this.brand;
    }

    getPrice() {
        return this.price;
    }

    getDimension() {
        return this.dimension;
    }

    getColor() {
        return this.color;
    }

    getCategory() {
        return this.category;
    }

    getAttribute() {
        return this.attribute;
    }

    getParentAttribute() {
        return this.parentAttribute;
    }
}

module.exports = {
    MongoProductDTO: MongoProductDTO,
    MySqlUpdateProductDTO: MySqlUpdateProductDTO,
    TransferDTO: TransferDTO,
    UpdateInventoryDTO: UpdateInventoryDTO,
};
