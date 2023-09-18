const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const {
	authenticateTokenService,
} = require('../../Service/AuthenticationService');

const {
	getAllWarehouseService,
	updateWarehouseService,
	deleteWarehouseService,
	insertWarehouseService,
	getInventoryService,
	getAllCategoryService, getAllProductService
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

router.post('/deletewarehouse', authenticateTokenService, async (req, res) => {
	try {
		const response = await deleteWarehouseService(req.userRole, {
			id: req.body.id,
		});
		if (!response.err) {
			res.send(200);
		} else {
			res.send(400);
		}
	} catch (e) {
		console.log(e.message);
	}
});

router.post('/createwarehouse', authenticateTokenService, async (req, res) => {
	try {
		const response = await insertWarehouseService(
			req.userRole,
			req.body.warehouse
		);
		if (response.err) {
			res.send(500);
		} else {
			res.send(200);
		}
	} catch (e) {
		console.log(e.message);
	}
});

router.get('/inventoryManagement', authenticateTokenService, (req, res) => {
	res.render('inventoryManagement.ejs');
});

router.post('/displayInvent', authenticateTokenService, async (req, res) => {
	try {
		const response = await getInventoryService({ user: req.userRole });
		console.log(response);
		res.send(response);
	} catch (e) {
		console.log(e.message);
	}
});

router.get('/categoryManagement', authenticateTokenService, async (req, res) =>{
	try{
		const cateList = await getAllCategoryService(req.userRole)
		res.render('categoryManagement.ejs', {cateList: cateList.message, token: req.query.token});
	}catch (e){
		return {error: e, message: e.message}
	}
})

router.get(`/getAllCateProduct`, authenticateTokenService, async (req, res) =>{
	try{
		const products = await getAllProductService(req.userRole)
		res.send({data: products.message});
	}catch (e){
		return {error: e, message: e.message}
	}
})

module.exports = router;
