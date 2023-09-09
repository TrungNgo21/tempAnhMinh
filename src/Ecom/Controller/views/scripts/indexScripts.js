let isRender = false;
async function fetchProducts() {
	try {
		const requestOptions = {
			method: 'GET',
		};
		const res = await fetch('/getProducts', requestOptions);
		const result = await res.json();
		return result.products;
	} catch (error) {
		console.error('Error sending POST request:', error);
	}
}

//send post request
async function sendPostRequest(url, req) {
	try {
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(req),
		};
		const res = await fetch(url, requestOptions);
		return await res.json();
	} catch (error) {
		console.error('Error sending POST request:', error);
	}
}

function renderProducts(products) {
	const productListDiv = document.getElementById('Display-Item');
	let rowDiv;

	products.forEach((product, index) => {
		if (index % 5 === 0) {
			rowDiv = document.createElement('div');
			rowDiv.className = 'product-row';
			productListDiv.appendChild(rowDiv);
		}

		const productInfo = document.createElement('div');
		const productName = document.createElement('h5');
		productInfo.className = 'productInfo';
		productInfo.style.paddingLeft = '10px';
		productName.innerText = `${product.name}`;
		productInfo.appendChild(productName);
		const productImg = document.createElement('div');
		const img = document.createElement('img');
		img.src = `${product.image}`;
		productImg.className = 'productImg';
		img.style = 'width:100%';
		productImg.appendChild(img);

		const productLink = document.createElement('a');
		productLink.appendChild(productImg);
		productLink.appendChild(productInfo);
		productLink.id = `${product.id}`;
		productLink.href = 'javascript:void(0);';
		productLink.className = 'product-link';

		productLink.addEventListener('click', async () => {
			window.location.href = `/productDetail?productId=${productLink.id}`;
		});
		rowDiv.appendChild(productLink);
	});
}

$(document).ready(async () => {
	try {
		const data = await fetchProducts();
		await renderProducts(data);
	} catch (e) {
		console.error(e);
	}
});
