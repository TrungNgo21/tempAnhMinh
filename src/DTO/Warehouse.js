class InsertWarehouseDTO {
	constructor(name, address, city, province, volume) {
		this.name = name;
		this.address = address;
		this.city = city;
		this.province = province;
		this.volume = volume;
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
class UpdateWarehouseDTO extends InsertWarehouseDTO {
	constructor(id, name, address, city, province, volume) {
		super(name, address, city, province, volume);
		this.id = id;
	}

	getId() {
		return this.id;
	}
}

class DeleteWarehouseDTO {
	constructor(id) {
		this.id = id;
	}

	getId() {
		return this.id;
	}
}

module.exports = {
	UpdateWarehouseDTO: UpdateWarehouseDTO,
	InsertWarehouseDTO: InsertWarehouseDTO,
	DeleteWarehouseDTO: DeleteWarehouseDTO,
};
