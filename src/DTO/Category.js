const { ObjectId } = require('mongodb');

class ShowCateDTO {
    constructor(id, name, parentId, attribute, parentAttribute) {
        this.id = id;
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

class InsertCateDTO {
    constructor(name, parentId, attribute) {
        this.name = name;
        if (parentId != null) {
            this.parentId = parentId;
        } else {
            this.parentId = parentId;
        }

        if (attribute != null) this.attribute = this._copyAttribute(attribute);
        else this.attribute = null;
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

    _copyAttribute(attribute) {
        const temp = [];
        attribute.forEach((e) => {
            temp.push({ name: e.name });
        });
        return temp;
    }
}

class UpdateCateDTO extends InsertCateDTO {
    constructor(id, name, parentId, attribute) {
        super(name, parentId, attribute);
        this.id = id;
    }

    getId() {
        return this.id;
    }
}

module.exports = { ShowCateDTO: ShowCateDTO, InsertCateDTO: InsertCateDTO, UpdateCateDTO: UpdateCateDTO };
