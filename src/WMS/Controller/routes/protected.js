const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {
	authenticateTokenService,
} = require('../../Service/AuthenticationService');

router.get('/', authenticateTokenService, (req, res) => {
	console.log(req.userRole);
	res.render('index');
});

module.exports = router;
