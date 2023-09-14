async function addToCart(event, token, productId) {
	event.preventDefault();
	const quantity = document.getElementById('cartQuantity').value;
	try {
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				productId: productId,
				quantity: quantity,
			}),
		};
		const response = await fetch(
			`/protected/product/addCart?token=${token}`,
			requestOptions
		);
	} catch (e) {
		console.error(e.message);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const urlParam = new URLSearchParams(window.location.search);
	const token = urlParam.get('token');
	const productId = urlParam.get('productId');
	console.log(token);
	try {
		document
			.getElementById('add-cart-button')
			.addEventListener('click', async (event) => {
				await addToCart(event, token, productId);
			});
	} catch (e) {
		console.error(e);
	}
});
