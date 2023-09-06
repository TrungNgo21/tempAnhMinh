const { ObjectId } = require('mongodb');

class AvailableProdDTO {
    constructor(productArray) {
        this.arrayId = [];
        for (let item of productArray) {
            this.arrayId.push(item.productId);
        }
    }

    getIds() {
        return this.arrayId;
    }
}

class InsertProdMySqlDTO {
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

class InsertProductDTO {
    constructor(name, brand, price, dimension, color, category, attribute, pAttribute) {
        this.name = name;
        this.brand = brand;
        this.price = price;
        this.dimension = { width: dimension.width, height: dimension.height, length: dimension.length };
        this.color = color;
        this.category = category;
        this.attribute = new Map(attribute.map((element) => [element.name, element.value]));
        if (pAttribute != null) this.pAttribute = new Map(pAttribute.map((element) => [element.name, element.value]));
        else this.pAttribute = new Map();
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
        return this.pAttribute;
    }

    getVolume() {
        return this.dimension.width * this.dimension.length * this.dimension.height;
    }

    getInsertMySqlDTO(id) {
        return new InsertProdMySqlDTO(id, this.getVolume());
    }
}

class UpdateProductDTO extends InsertProductDTO {
    constructor(id, name, brand, price, dimension, color, category, attribute, pAttribute) {
        super(name, brand, price, dimension, color, category, attribute, pAttribute);
        this.id = id;
    }
    getId() {
        return this.id;
    }
}

module.exports = {
    InsertProductDTO: InsertProductDTO,
    UpdateProductDTO: UpdateProductDTO,
    AvailableProdDTO: AvailableProdDTO,
    InsertProdMySqlDTO: InsertProdMySqlDTO,
};
