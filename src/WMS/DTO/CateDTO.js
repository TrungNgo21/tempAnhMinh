class CateDTO {
    constructor(name, parentId, attribute, parentAttribute) {
        this.name = name;
        this.parentId = parentId;
        this.attribute = this._copyAttribute(attribute);
        this.parentAttribute = this._copyAttribute(parentAttribute);
    }

    getName() {
        return this.name;
    }

    getParentId() {
        return this.parentId;
    }

    getAttribute() {
        return this.attribute;
    }

    getParentAttribute() {
        return this.parentAttribute;
    }

    setName(name) {
        this.name = name;
    }

    setParentId(parentId) {
        this.parentId = parentId;
    }

    setParentAttribute(parentAttribute) {
        this.parentAttribute = this._copyAttribute(parentAttribute);
    }

    setAttribute(attribute) {
        this.attribute = this._copyAttribute(attribute);
    }

    _copyAttribute(attribute) {
        const temp = [];
        attribute.forEach((e) => {
            temp.push({ name: e.name, value: e.value });
        });
        return temp;
    }
}

module.exports = CateDTO;
