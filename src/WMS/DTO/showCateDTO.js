class showCateDTO {
    constructor(name, parentId, attribute, parentAttribute) {
        this.name = name;
        this.parentId = parentId;

        this.attribute = this._copyAttribute(attribute);

        this.parentAttribute = this._copyAttribute(parentAttribute);
    }

    _copyAttribute(attribute) {
        const temp = [];
        attribute.forEach((e) => {
            temp.push({ name: e.name });
        });
        return temp;
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
}
