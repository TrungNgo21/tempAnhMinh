const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {
	authenticateUserService,
} = require('../../Service/AuthenticationService');
router.get('/', (req, res) => {
	res.render('login');
});

router.post('/', async (req, res) => {
	const { username, password } = req.body;
	try {
		const authentication = await authenticateUserService({
			username: username,
			password: password,
		});
		if (!authentication.success) {
			return res.send('Invalid username or password');
		}
		res.send({ token: authentication.token });
	} catch (e) {
		console.error(e);
	}
});

module.exports = router;
