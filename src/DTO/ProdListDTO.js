class EcomProdList {
    constructor(arrayList) {
        this.array = [];
        for (const item of arrayList) {
            this.array.push({
                image: 'Banana-Single.jpg',
                id: item._id.toString(),
                name: item.name,
                brand: item.brand,
                price: item.price,
                source: 'Warehouse A',
            });
        }
    }

    getList() {
        return this.array;
    }
}

module.exports = { EcomProdList: EcomProdList };
