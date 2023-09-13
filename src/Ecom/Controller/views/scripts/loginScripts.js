document.addEventListener('DOMContentLoaded', () => {
	const loginForm = document.getElementById('cusLogin');
	loginForm.addEventListener('submit', async (event) => {
		await authenticate(event);
	});
});

async function authenticate(event) {
	event.preventDefault();
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	try {
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: username, password: password }),
		};
		const res = await fetch('/', requestOptions);
		if (!res.ok) {
			console.error('error');
		}
		const data = await res.json();
		window.location.href = `/protected/?token=${data.token}`;
	} catch (error) {
		console.error('Error sending POST request:', error);
	}
}
