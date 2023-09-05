class UpdateWarehouseDTO {
    constructor(id, name, address, city, province, volume) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.city = city;
        this.province = province;
        this.volume = volume;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getAddress() {
        return this.address;
    }

    getCity() {
        return this.city;
    }

    getProvince() {
        return this.province;
    }

    getVolume() {
        return this.volume;
    }
}

module.exports = { UpdateWarehouseDTO: UpdateWarehouseDTO };
