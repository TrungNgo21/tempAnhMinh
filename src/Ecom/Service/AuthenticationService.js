const jwt = require('jsonwebtoken');
const { authenticateUser, getUserRole } = require('../../Repository/MySqlRepo');

async function authenticateUserService(mapObject) {
	try {
		const authentication = await authenticateUser(
			mapObject.username,
			mapObject.password
		);
		if (authentication.err) {
			return {
				success: false,
			};
		}
		return { success: true, token: authentication.token };
	} catch (e) {
		console.error(e);
	}
}

async function authenticateTokenService(req, res, next) {
	console.log(req.query.token);
	const token = req.query.token;

	if (!token) {
		return res.redirect('/');
	}

	try {
		const { username } = jwt.verify(token, '92BC8A7FBBD5475D75C11CC1EA98E');
		const { err, role } = await getUserRole(username);
		req.userRole = role;
		next();
	} catch (e) {
		console.log(e.message);
		return res.redirect('/?error=TokenNotProvided');
	}
}

module.exports = {
	authenticateUserService: authenticateUserService,
	authenticateTokenService: authenticateTokenService,
};
