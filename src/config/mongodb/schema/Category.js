const { mongoose, Schema } = require('mongoose');

const categorySchema = new Schema(
    {
        name: String,
        parentCate: { type: Schema.Types.ObjectId, ref: 'categories' },
        attribute: [{}],
    },
    {
        statics: {
            async validateDelete(id, product) {
                const result = await this.findById(id).lean().exec();
                if (result == null) return { valid: false, id: null };

                const isParent = await this.countDocuments({ parentCate: id }).lean().exec();
                if (isParent != 0) return { valid: false, id: id };

                const prodCount = await product.countDocuments({ category: result._id }).lean().exec();

                return { valid: prodCount == 0, id: result._id };
            },
            async validateUpdate(cateDTO, product) {
                const result = await this.find({ name: cateDTO.name, parentCate: cateDTO.parentId }, '_id')
                    .lean()
                    .exec();

                if (result.length == 0) return { valid: true, id: null };

                const prodCount = await product.countDocuments({ category: result[0]._id }).lean().exec();

                return { valid: prodCount == 0, id: result[0]._id };
            },
            getProducts(product) {
                return product.find({ category: this._id });
            },
        },
        query: {
            byName(name) {
                return this.where({ name: new RegExp(name, 'i') });
            },
            byBrand(brand) {
                return this.where({ brand: new RegExp(brand, 'i') });
            },
        },
    }
).index({ name: 1, parentId: 1 }, { unique: true });

function getCateModel(conn) {
    return conn.model('Categories', categorySchema);
}

module.exports = { CategoryModel: getCateModel };
