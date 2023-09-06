class UpdateInventoryDTO {
    constructor(id, qty) {
        this.id = id;
        this.qty = qty;
    }

    getId() {
        return this.id;
    }

    getQty() {
        return this.qty;
    }
}

class TransferDTO {
    constructor(id, fromWh, toWh, qty) {
        this.id = id;
        this.fromWh = fromWh;
        this.toWh = toWh;
        this.qty = qty;
    }

    getId() {
        return this.id;
    }

    getFromWh() {
        return this.fromWh;
    }

    getToWh() {
        return this.toWh;
    }

    getQty() {
        return this.qty;
    }
}

module.exports = { UpdateInventoryDTO: UpdateInventoryDTO, TransferDTO: TransferDTO };
