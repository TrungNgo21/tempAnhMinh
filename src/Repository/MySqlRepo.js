const getMySqlConn = require('../config/sql/connector');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('express');

const TYPE = {
	SELECT: true,
	ELSE: false,
};

const CHOICE = {
	CREATE_WH: 0,
	UPDATE_WH: 1,
	CREATE_PROD: 2,
	UPDATE_PROD: 3,
	UPDATE_INV: 4,
	TRANSFER_INV: 5,
	DELETE_WH: 6,
};

async function insertProduct(user, createProductDTO) {
	try {
		const result = await queryWrapper(
			user,
			`insert into product (id, volume) value ('${createProductDTO.getId()}', '${createProductDTO.getVolume()}')`
		);
		if (result.affectedRows !== 1) {
			return { err: true, message: 'create product fail' };
		}
		return {
			err: false,
			message: 'create product success',
			id: createProductDTO.getId(),
		};
	} catch (e) {
		return { err: true, message: e.message };
	}
}

async function updateProduct(user, updateProductDTO) {
	try {
		const result = await queryWrapper(
			user,
			`update product set volume = ${updateProductDTO.getVolume()} where id = '${updateProductDTO.getId()}'`
		);

		if (result.affectedRows !== 1) {
			return { err: true, message: 'update product fail' };
		}
		return {
			err: false,
			message: 'update product success',
			id: updateProductDTO.getId(),
		};
	} catch (e) {
		return { err: true, message: e.message };
	}
}

async function transferInvent(user, transferDTO) {
	try {
		const result = await queryWrapper(
			user,
			`call product_transfer(
			'${transferDTO.getId()}', 
			${transferDTO.getFromWh()}, 
			${transferDTO.getToWh()}, 
			${transferDTO.getQty()});`
		);
		if (result[0].err) {
			return { err: true, message: 'target inventory is full' };
		}
		return { err: false, message: 'transfer success' };
	} catch (e) {
		return { err: true, message: e.message };
	}
}

async function insertWarehouse(user, CreateWhDTO) {
	try {
		const result = await queryWrapper(
			user,
			`insert into warehouse (name, address, city, province, volume) value (
                '${CreateWhDTO.getName()}', 
                '${CreateWhDTO.getAddress()}', 
                '${CreateWhDTO.getCity()}', 
                '${CreateWhDTO.getProvince()}', 
                ${CreateWhDTO.getVolume()})`
		);
		if (result.affectedRows !== 1) {
			return { err: true, message: 'create warehouse fail' };
		}
		return {
			err: false,
			message: 'create warehouse success',
			id: result.insertId,
		};
	} catch (e) {
		return { err: true, message: e.message };
	}
}

async function updateWarehouse(user, updateWhDTO) {
	try {
		const result = await queryWrapper(
			user,
			`update warehouse 
                set 
                    name = '${updateWhDTO.getName()}', 
                    address = '${updateWhDTO.getAddress()}',
                    city = '${updateWhDTO.getCity()}', 
                    province = '${updateWhDTO.getProvince()}', 
                    volume = ${updateWhDTO.getVolume()}
                where id = ${updateWhDTO.getId()}`
		);
		if (result.affectedRows !== 1) {
			return { err: true, message: 'update warehouse fail' };
		}
		return {
			err: false,
			message: 'update warehouse success',
			id: updateWhDTO.getId(),
		};
	} catch (e) {
		return { err: true, message: e.message };
	}
}

async function updateInventory(user, updateInventoryDTO) {
	try {
		const result = await queryWrapper(
			user,
			`call product_purchase_order ('${updateInventoryDTO.getId()}', ${updateInventoryDTO.getQty()})`
		);
		if (result[0].err) {
			return {
				err: true,
				message: 'inventory exceed all warehouse capacity',
			};
		}
		return { err: false, message: 'PO success' };
	} catch (e) {
		return { err: true, message: e.message };
	}
}

async function deleteWarehouse(user, deleteWhDTO) {
	try {
		await queryWrapper(
			user,
			`delete from warehouse where id = ${deleteWhDTO.getId()}`
		);
		return { err: false, message: 'delete warehouse success' };
	} catch (e) {
		return { err: true, message: e.message };
	}
}

async function getAllWarehouse(user, searchString = null) {
	try {
		let queryString =
			'select id, name, address, city, province, volume, fillVolume from warehouse';
		if (searchString) {
			queryString += ` where name like '${searchString}' or address like '${searchString}' or city like '${searchString}' or province like '${searchString}'`;
		}
		const result = await queryWrapper(user, queryString);
		return { err: false, message: result };
	} catch (e) {
		return { err: true, message: e.message };
	}
}

async function getAvailableProduct(user) {
	try {
		const result = await queryWrapper(
			user,
			'select productId from warehouse_inventory where quantity > 0 group by productId'
		);
		return { err: false, message: result };
	} catch (e) {
		return { err: true, message: e.message };
	}
}

async function getProductInventory(user, id) {
	try {
		const result = await queryWrapper(
			user,
			`select sum(quantity) as inventory from warehouse_inventory where BINARY productId = '${id}'`
		);
		return { err: false, message: result[0] };
	} catch (e) {
		return { err: true, message: e.message };
	}
}

async function authenticateUser(username, password) {
	try {
		const result = await queryWrapper(
			'root',
			`select * from users where binary username ='${username}'`
		);
		if (result.length === 0) {
			return { err: true };
		}
		const user = result[0];
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (passwordMatch) {
			const token = await storeAccessToken(user.username);
			return { err: false, token: token.token };
		}
		return { err: true };
	} catch (e) {
		console.error(e);
		return { err: true };
	}
}

async function storeAccessToken(username) {
	const root = 'root';
	try {
		const token = jwt.sign({ username }, '92BC8A7FBBD5475D75C11CC1EA98E', {
			expiresIn: '1h',
		});
		await queryWrapper(
			root,
			`insert into tokens (username, token) value ('${username}', '${token}')`
		);
		return { err: false, token: token };
	} catch (e) {
		return { err: true, message: e.message };
	}
}

async function getUserRole(username) {
	const root = 'root';
	try {
		const result = await queryWrapper(
			root,
			`select role from users where binary username = '${username}'`
		);
		if (result.length === 0) {
			return { err: true };
		}
		return { err: false, role: result[0].role };
	} catch (e) {
		return { err: true, message: e.message };
	}
}
async function getUser(token) {
	const root = 'root';
	try {
		const result = await queryWrapper(
			root,
			`select username from tokens where binary token = '${token}'`
		);
		if (result.length === 0) {
			return { err: true };
		}
		return { err: false, id: result[0].username };
	} catch (e) {
		return { err: true, message: e.message };
	}
}

async function updateUserCart(userId, productId, quantity) {
	const root = 'root';
	try {
		const result = await queryWrapper(
			root,
			`insert into user_cart (userId, productId, quantity) value ('${userId}', '${productId}', '${quantity}') on duplicate key update quantity = quantity + ${quantity}`
		);
		if (result.affectedRows === 0) {
			return { err: true, message: 'error insert values' };
		}
		return { err: false, message: 'success add product to user cart' };
	} catch (e) {
		return { err: true, message: 'system error' };
	}
}

async function getUserCart(userId) {
	const root = 'root';
	try {
		const result = await queryWrapper(
			root,
			`select productId, quantity from user_cart where binary userId = '${userId}' order by productId asc `
		);
		return { err: false, products: result };
	} catch (e) {
		return { err: true, message: 'system error' };
	}
}

async function removeUserCart(userId, productId) {
	const root = 'root';
	try {
		const result = await queryWrapper(
			root,
			`delete from user_cart where binary userId = '${userId}' and productId = '${productId}'`
		);
		if (result.affectedRows !== 1) {
			return { err: true };
		}
		return { err: false };
	} catch (e) {
		return { err: true, message: 'system error' };
	}
}

async function makeTransaction(userId, cart) {
	const root = 'root';
	try {
		const aCart = JSON.stringify(cart);
		const result = await queryWrapper(
			root,
			`call create_transaction('${userId}', '${aCart}')`
		);
		if (result[0][0].err) {
			return { err: true };
		}
		return { err: false };
	} catch (e) {
		return { err: true, message: 'system error' };
	}
}

async function getInventory(user) {
	try {
		const result = await queryWrapper(
			user,
			'select warehouseId, productId, quantity from warehouse_inventory'
		);
		return { err: false, message: result };
	} catch (e) {
		return { err: true, message: 'system error' };
	}
}

async function queryWrapper(user, sql) {
	let conn;
	try {
		conn = await getMySqlConn(user);
		const [result] = await conn.execute(sql);
		return result;
	} catch (e) {
		throw new Error(e.message);
	} finally {
		if (!!conn) {
			await conn.end();
		}
	}
}

module.exports = {
	insertWareHouseMySql: insertWarehouse,
	updateWareHouseMySql: updateWarehouse,
	deleteWarehouseMySql: deleteWarehouse,
	getAllWarehouse: getAllWarehouse,
	insertProductMySql: insertProduct,
	updateProductMySql: updateProduct,
	updateInventoryMySql: updateInventory,
	transferInventMySql: transferInvent,
	getAvailableProductMySql: getAvailableProduct,
	getProductInventory: getProductInventory,
	authenticateUser: authenticateUser,
	getUserRole: getUserRole,
	getUser: getUser,
	updateUserCart: updateUserCart,
	getUserCart: getUserCart,
	removeUserCart: removeUserCart,
	makeTransaction: makeTransaction,
	getInventory: getInventory,
};
