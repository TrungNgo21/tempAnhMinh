document.addEventListener('DOMContentLoaded', async () => {
	const urlParam = new URLSearchParams(window.location.search);
	const token = urlParam.get('token');
	await renderDisplay(token);
});

async function getwhInvent(token, searchString) {
	try {
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ search: searchString }),
		};
		const res = await fetch(
			`/protected/displayInvent?token=${token}`,
			requestOptions
		);
		return await res.json();

		if (!response.ok) {
			throw new Error('Error fetching product data');
		}
	} catch (e) {}
}

async function renderDisplay(token, searchString = null) {
	const whInventList = await getwhInvent(token, searchString);
	console.log(whInventList);
	const inventoryContainer = document.getElementById('inventory-container');

	whInventList.forEach((warehouse) => {
		const inventory = warehouse.inventory;

		const warehouseRow = document.createElement('tr');
		warehouseRow.classList.add('inventory-row');
		warehouseRow.innerHTML = `<td>${warehouse.name}</td><td>${warehouse.address}</td><td>${warehouse.fillVolume}</td><td>${warehouse.volume}</td>`;
		inventoryContainer.appendChild(warehouseRow);

		const hiddenRow = createHiddenContainer(inventory);

		inventoryContainer.appendChild(hiddenRow);
	});
	const inventoryRows = document.querySelectorAll('.inventory-row');
	inventoryRows.forEach((row) => {
		row.addEventListener('click', () => {
			const hiddenRow = row.nextElementSibling;
			hiddenRow.classList.toggle('hidden-row');
		});
	});
}

function createHiddenContainer(inventory) {
	const hiddenRow = document.createElement('tr');
	hiddenRow.classList.add('hidden-row');

	const hiddenCell = document.createElement('td');
	hiddenCell.setAttribute('colspan', '5');

	const inventoryTable = document.createElement('table');
	inventoryTable.classList.add('table', 'table-hover');

	const headerContainer = document.createElement('thread');
	headerContainer.classList.add('hidden-header');
	const headerRow = createHiddenHeader();
	headerContainer.appendChild(headerRow);

	const bodyRow = document.createElement('tbody');

	inventory.forEach((product) => {
		const productRow = document.createElement('tr');
		productRow.innerHTML = `<td>${product.productName}</td><td>${product.category}</td><td>W: ${product.size.width}, H: ${product.size.height}, L: ${product.size.length}</td><td>${product.quantity}</td>`;
		bodyRow.appendChild(productRow);
	});
	inventoryTable.appendChild(headerContainer);
	inventoryTable.appendChild(bodyRow);
	hiddenCell.appendChild(inventoryTable);
	hiddenRow.appendChild(hiddenCell);
	return hiddenRow;
}

function createHiddenHeader() {
	const headerRow = document.createElement('tr');
	headerRow.classList.add('header');
	headerRow.innerHTML =
		'<th>Product Name</th><th>Product category</th><th>Product Size</th><th>Quantity</th>';

	return headerRow;
}
