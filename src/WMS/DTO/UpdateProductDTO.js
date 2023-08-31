const { ObjectId } = require('mongodb');

class updateProductDTO {
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

module.exports = updateProductDTO;
