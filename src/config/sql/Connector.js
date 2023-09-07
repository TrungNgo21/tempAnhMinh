const mysql = require('mysql2/promise');
const bluebird = require('bluebird');

const cred = {
	whadmin: 'CnSNL2Dw50Hd9gui',
	staff: 'vVlOlqte0giTh1IQ',
	customer: 'vVlOlqte0giTh1IQ',
	root: 'password',
};
async function getMySqlConn(user) {
	return await mysql.createConnection({
		user: user,
		password1: cred[user],
		database: 'public',
		Promise: bluebird,
	});
}

module.exports = getMySqlConn;
