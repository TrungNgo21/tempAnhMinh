const { ObjectId } = require('mongodb');

class updateCateDTO {
    constructor(name, parentId, attribute) {
        this.name = name;
        if (parentId != null) {
            this.parentId = new ObjectId(parentId);
        } else {
            this.parentId = parentId;
        }

        this.attribute = this._copyAttribute(attribute);
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

    setName(name) {
        this.name = name;
    }

    setParentId(parentId) {
        this.parentId = parentId;
    }

    setAttribute(attribute) {
        this.attribute = this._copyAttribute(attribute);
    }

    _copyAttribute(attribute) {
        const temp = [];
        attribute.forEach((e) => {
            temp.push({ name: e.name });
        });
        return temp;
    }
}

module.exports = updateCateDTO;
