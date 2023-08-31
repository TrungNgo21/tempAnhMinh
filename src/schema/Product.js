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
        category: mongoose.Schema.Types.ObjectId,
        attribute: { type: Map, of: String },
    },
    {
        statics: {
            async validateUpdate(updateProductDTO, category) {
                const result = await category.findOne({ _id: updateProductDTO.category }, 'parentId attribute');
                let attribute = result.attribute;
                let pAttribute;
                if (result.parentId != null) {
                    pAttribute = await category.findOne({ _id: result.parentId }, 'attribute');
                } else pAttribute = [];

                if (
                    attribute.length != updateProductDTO.attribute.size ||
                    pAttribute.length != updateProductDTO.parentAttribute.size
                ) {
                    return false;
                }
                for (a in attribute) {
                    if (!updateProductDTO.attribute.has(a.name)) {
                        return false;
                    }
                }
                for (a in pAttribute) {
                    if (!updateProductDTO.parentAttribute.has(a.name)) {
                        return false;
                    }
                }
                return true;
                // const pAttribute = await result.getParentAttribute(result.model.parentId);
                // const attribute = result.attribute;
                // if (
                //     attribute.length !== updateProductDTO.attribute.size ||
                //     pAttribute.length !== updateProductDTO.parentAttribute.size
                // ) {
                //     return false;
                // }
                // for (a in attribute) {
                //     if (!updateProductDTO.attribute.has(a.name)) return false;
                // }
                // for (a in pAttribute) {
                //     if (!updateProductDTO.parentAttribute.has(a.name)) return false;
                // }
                // return true;
            },
        },
        methods: {
            getVolume() {
                return this.dimension.width * this.dimension.height * this.dimension.length;
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
module.exports = { schema: productSchema, model: getProductModel };
