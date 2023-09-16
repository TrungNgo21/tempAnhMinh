async function selectCategory(token, categoryId = null) {
	try {
		let url = `/protected/?token=${token}`;
		const navbarSelection = document.getElementById('navbarDropdown');
		if (categoryId) {
			url += `&&category=${categoryId}`;
		}
		window.location.href = url;
	} catch (error) {
		console.error('Error sending GET request:', error);
	}
}
