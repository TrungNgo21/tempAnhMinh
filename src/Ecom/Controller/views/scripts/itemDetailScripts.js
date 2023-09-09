const params = new URLSearchParams(window.location.search);
const productId = params.get('productId');

async function fetchProduct() {
	try {
		try {
			const requestOptions = {
				method: 'GET',
			};
			const res = await fetch(`/product/${productId}`, requestOptions);
			const result = await res.json();
			return result.product;
		} catch (error) {
			console.error('Error sending POST request:', error);
		}
	} catch (e) {}
}

function renderDetail(productData) {
	const img_showcase = document.getElementById('img-showcase');

	const img = document.createElement('img');
	img.src = `${productData.image}`;
	img_showcase.appendChild(img);

	const productInfo = document.getElementById('product-attribute');
	const productTitle = document.getElementById('product-title');
	productTitle.innerHTML = `${productData.name}`;

	const price = document.getElementById('price');
	price.innerHTML = `Price: <span>$${productData.price}</span>`;

	const productDetailList = document.getElementById('product-detail-list');

	const brand = document.createElement('li');
	brand.innerHTML = `Brand: <span>${productData.brand}</span>`;
	const color = document.createElement('li');
	color.innerHTML = `Color: <span>${productData.color}</span>`;
	const dimension = document.createElement('li');
	dimension.innerHTML = `Dimension: <span>${productData.dimension}</span>`;
	const category = document.createElement('li');
	category.innerHTML = `Category: <span>${productData.category}</span>`;
	const attribute = document.createElement('li');
	attribute.innerHTML = `Attribute: <span>${productData.attribute}</span>`;
	const pAttribute = document.createElement('li');
	pAttribute.innerHTML = `pAttribute: <span>${productData.pAttribute}</span>`;

	productDetailList.appendChild(brand);
	productDetailList.appendChild(color);
	productDetailList.appendChild(dimension);
	productDetailList.appendChild(category);
	productDetailList.appendChild(attribute);
	productDetailList.appendChild(pAttribute);
}

$(document).ready(async () => {
	try {
		const data = await fetchProduct();
		console.log(data);
		renderDetail(data);
	} catch (e) {
		console.error(e);
	}
});
