document.addEventListener('DOMContentLoaded', async () => {
	const urlParam = new URLSearchParams(window.location.search);
	const token = urlParam.get('token');

	const cartButton = document.getElementById('cart-button');
	cartButton.addEventListener('click', async (event) => {
		event.preventDefault();
		window.location.href = `/protected/cart?token=${token}`;
	});

	const searchButton = document.getElementById('search-button');
	searchButton.addEventListener('click', async (event) => {
		event.preventDefault();
		let url = `/protected/?token=${token}`;
		const urlParam = new URLSearchParams(window.location.search);
		const searchString = document.getElementById('search-input');
		const cateSelect = urlParam.get('cateSelect');
		if (cateSelect) {
			url += `&&category=${cateSelect._id}`;
		}
		url += `&&searchString=${searchString.value}`;
		window.location.href = url;
	});
});
