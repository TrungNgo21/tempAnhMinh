document.addEventListener('DOMContentLoaded', async () => {
	const urlParam = new URLSearchParams(window.location.search);
	const token = urlParam.get('token');

	const cartButton = document.getElementById('cart-button');
	cartButton.addEventListener('click', async (event) => {
		event.preventDefault();
		window.location.href = `/protected/cart?token=${token}`;
	});
});
