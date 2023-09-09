async function checkTokenValidity(token) {
	try {
		const response = await fetch('/check-token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token: token }),
		});
		if (response.status !== 200) {
			window.location.href = '/login';
		}
	} catch (e) {
		console.error(e);
	}
}

module.exports = { checkTokenValidity };
