const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const {
	authenticateTokenService,
} = require('../../Service/AuthenticationService');

const {
	getAllWarehouseService,
	updateWarehouseService,
} = require('../../Service/WMSService');
const { response } = require('express');

router.get('/', authenticateTokenService, async (req, res) => {
	res.render('warehouseManagement.ejs');
});

router.post('/', authenticateTokenService, async (req, res) => {
	try {
		let response;
		if (req.body.search) {
			response = await getAllWarehouseService(
				req.userRole,
				req.body.search
			);
		} else {
			response = await getAllWarehouseService(req.userRole);
		}
		await res.send(response.message);
	} catch (e) {
		console.error(e.message);
	}
});

router.post('/updatewarehouse', authenticateTokenService, async (req, res) => {
	try {
		const response = await updateWarehouseService(
			req.userRole,
			req.body.warehouse
		);
		if (!response.err) {
			res.send(200);
		}
	} catch (e) {
		console.error(e.message);
	}
});

module.exports = router;
