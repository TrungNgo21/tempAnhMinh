const { mongoose, Schema } = require('mongoose');

const productSchema = new Schema(
    {
        name: String,
        brand: String,
        price: Number,
        color: String,
        dimension: {
            width: mongoose.Schema.Types.Decimal128,
            height: mongoose.Schema.Types.Decimal128,
            length: mongoose.Schema.Types.Decimal128,
        },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
        attribute: { type: Map, of: String },
        pAttribute: { type: Map, of: String },
    },
    {
        statics: {
            async validateInsert(insertProductDTO, category) {
                let result = await category
                    .find({ _id: insertProductDTO.getCategory() }, 'parentId attribute')
                    .lean()
                    .exec();

                const attribute = result[0].attribute;

                let pAttribute;
                if (result[0].parentId != null) {
                    result = await category.find({ _id: result[0].parentId }, 'attribute').lean().exec();
                    pAttribute = result[0].attribute;
                } else pAttribute = [];

                if (
                    attribute.length !== insertProductDTO.getAttribute().size ||
                    pAttribute.length !== insertProductDTO.getParentAttribute().size
                ) {
                    return false;
                }

                attribute.forEach((a) => {
                    if (!insertProductDTO.getAttribute().has(a.name)) {
                        return false;
                    }
                });

                pAttribute.forEach((a) => {
                    if (!insertProductDTO.getParentAttribute().has(a.name)) {
                        return false;
                    }
                });
                return true;
            },
        },

        query: {
            query: {
                byName(name) {
                    return this.where({ name: new RegExp(name, 'i') });
                },
                byBrand(brand) {
                    return this.where({ brand: new RegExp(brand, 'i') });
                },
            },
        },
    }
).index({ name: 1, brand: 1, category: 1 }, { unique: true });

function getProductModel(conn) {
    return conn.model('Products', productSchema);
}
module.exports = { ProductModel: getProductModel };
