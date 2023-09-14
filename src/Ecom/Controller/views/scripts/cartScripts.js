// document.addEventListener('DOMContentLoaded', async () => {
// 	const urlParam = new URLSearchParams(window.location.search);
// 	const token = urlParam.get('token');
// 	// try {
// 	// 	const data = await fetchProducts(token);
// 	// 	await renderProducts(token, data);
// 	// } catch (e) {
// 	// 	console.error(e);
// 	// }
// });
//
// async function renderProducts(token, data) {
// 	const cartContainer = document.getElementById('cart-container');
// 	data.forEach((product) => {
// 		const productRow = document.createElement('div');
// 		productRow.classList.add('product-row');
//
// 		const productIcon = document.createElement('img');
// 		productIcon.classList.add('product-icon');
// 		productIcon.src = product.image;
// 		productRow.appendChild(productIcon);
//
// 		const productDetails = document.createElement('div');
// 		productDetails.classList.add('product-details');
//
// 		const descriptionColum1 = document.createElement('div');
// 		descriptionColum1.classList.add('description-column');
//
// 		const productName = document.createElement('div');
// 		productName.classList.add('product-name');
// 		productName.textContent = `${product.name}`;
// 		descriptionColum1.appendChild(productName);
//
// 		const productCategory = document.createElement('div');
// 		productCategory.classList.add('product-category');
// 		productCategory.textContent = `Category: ${product.category}`;
// 		descriptionColum1.appendChild(productCategory);
//
// 		const descriptionColum2 = document.createElement('div');
// 		descriptionColum2.classList.add('description-column');
//
// 		const productIndiPriceContainer = document.createElement('div');
// 		const productIndiPriceHeader = document.createElement('div');
// 		productIndiPriceHeader.classList.add('description-header');
// 		productIndiPriceHeader.textContent = 'Individual price';
// 		const productIndiPrice = document.createElement('span');
// 		productIndiPrice.textContent = product.price;
// 		productIndiPriceContainer.appendChild(productIndiPriceHeader);
// 		productIndiPriceContainer.appendChild(productIndiPrice);
//
// 		descriptionColum2.appendChild(productIndiPriceContainer);
//
// 		const descriptionColum3 = document.createElement('div');
// 		descriptionColum3.classList.add('description-column');
//
// 		const productTotalPriceContainer = document.createElement('div');
// 		const productTotalPriceHeader = document.createElement('div');
// 		productTotalPriceHeader.classList.add('description-header');
// 		productTotalPriceHeader.textContent = 'Total price';
// 		const productTotalPrice = document.createElement('span');
// 		productTotalPrice.textContent = `${product.price * product.quantity}`;
// 		productTotalPriceContainer.appendChild(productTotalPriceHeader);
// 		productTotalPriceContainer.appendChild(productTotalPrice);
//
// 		descriptionColum3.appendChild(productTotalPriceContainer);
// 		productDetails.appendChild(descriptionColum1);
// 		productDetails.appendChild(descriptionColum2);
// 		productDetails.appendChild(descriptionColum3);
//
// 		productRow.appendChild(productDetails);
//
// 		const productQuantity = document.createElement('div');
// 		productQuantity.classList.add('product-quantity');
//
// 		const quantityValueContainer = document.createElement('div');
// 		quantityValueContainer.classList.add('description-column');
// 		const quantityHeader = document.createElement('div');
// 		quantityHeader.classList.add('description-header');
// 		quantityHeader.textContent = 'Quantity';
// 		const quantitySpan = document.createElement('span');
// 		quantitySpan.textContent = `${product.quantity}`;
//
// 		quantityValueContainer.appendChild(quantityHeader);
// 		quantityValueContainer.appendChild(quantitySpan);
//
// 		productQuantity.appendChild(quantityValueContainer);
//
// 		const removeButton = document.createElement('button');
// 		removeButton.classList.add('remove-button');
// 		removeButton.textContent = 'Remove';
// 		removeButton.addEventListener('click', async (event) => {
// 			await removeProduct(event, token, product.id);
// 			productRow.remove();
// 		});
// 		productQuantity.appendChild(removeButton);
//
// 		productRow.appendChild(productQuantity);
//
// 		cartContainer.appendChild(productRow);
// 	});
//
// 	const subtotalContainer = document.createElement('div');
// 	subtotalContainer.classList.add('subtotal-container');
//
// 	const subtotalValueContainer = document.createElement('div');
// 	subtotalValueContainer.classList.add('description-column');
//
// 	const subtotalHeader = document.createElement('div');
// 	subtotalHeader.classList.add('description-header');
// 	subtotalHeader.textContent = 'Subtotal:';
//
// 	const subtotalValue = document.createElement('div');
// 	subtotalValue.classList.add('subtotal-value');
// 	subtotalValue.textContent = `${totalBill}`;
//
// 	subtotalValueContainer.appendChild(subtotalHeader);
// 	subtotalValueContainer.appendChild(subtotalValue);
//
// 	const purchaseButton = document.createElement('button');
// 	purchaseButton.classList.add('purchase-button');
// 	purchaseButton.textContent = 'Purchase';
// 	purchaseButton.addEventListener('click', async (event) => {
// 		event.preventDefault();
// 		console.log('purchase item');
// 	});
//
// 	subtotalContainer.appendChild(subtotalValueContainer);
// 	subtotalContainer.appendChild(purchaseButton);
//
// 	cartContainer.appendChild(subtotalContainer);
// }

async function removeProduct(token, id) {
	event.preventDefault();
	try {
		const requestOptions = {
			method: 'GET',
		};
		const res = await fetch(
			`/protected/removeCart?token=${token}&&productId=${id}`,
			requestOptions
		);
		if (!res.err) {
			window.location.href = `/protected/cart?token=${token}`;
		}
	} catch (error) {
		console.error('Error sending GET request:', error);
	}
	console.log('here');
}
