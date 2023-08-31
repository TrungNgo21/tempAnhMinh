const { mongoose, Schema } = require('mongoose');

const categorySchema = new Schema(
    {
        name: String,
        parentId: mongoose.Schema.Types.ObjectId,
        attribute: [{}],
    },
    {
        statics: {
            validateUpdate(cateDTO, product) {
                const result = this.find({ name: cateDTO.name, parentId: cateDTO.parentId }, '_id').lean();

                if (result == null) {
                    return { valid: true, id: null };
                }

                return { valid: product.find({ category: result._id }), id: result._id };
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

module.exports = { schema: categorySchema, model: getCateModel };
