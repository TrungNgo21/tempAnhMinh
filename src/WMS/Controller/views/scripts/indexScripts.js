document.addEventListener('DOMContentLoaded', async () => {
	const urlParam = new URLSearchParams(window.location.search);
	const token = urlParam.get('token');
	const rendered = false;
	if (!rendered) {
		await renderDisplay(token);
	}

	document
		.getElementById('search-button')
		.addEventListener('click', async (event) => {
			event.preventDefault();
			clearTableDisplay();
			await renderDisplay(token, $('#search-value').val());
		});

	const updateButtons = document.querySelectorAll('.update-product');

	updateButtons.forEach((button) => {
		button.addEventListener('click', () => {
			const modal = document.getElementById('updateModal');
			const name = button.getAttribute('data-name');
			const address = button.getAttribute('data-address');
			const province = button.getAttribute('data-province');
			const city = button.getAttribute('data-city');
			const id = button.getAttribute('data-id');
			const volume = button.getAttribute('data-volume');

			modal.querySelector('#edit-name').value = name;
			modal.querySelector('#edit-address').value = address;
			modal.querySelector('#edit-province').value = province;
			modal.querySelector('#edit-city').value = city;

			const commitButton = document.getElementById('commit-update');
			commitButton.addEventListener('click', async () => {
				try {
					const requestOptions = {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							warehouse: {
								name: modal.querySelector('#edit-name').value,
								address:
									modal.querySelector('#edit-address').value,
								city: modal.querySelector('#edit-city').value,
								province:
									modal.querySelector('#edit-province').value,
								volume: volume,
								id: id,
							},
						}),
					};
					const res = await fetch(
						`/protected/updatewarehouse?token=${token}`,
						requestOptions
					);
					if (await res.ok) {
						clearTableDisplay();
						await renderDisplay(token);
						modal.querySelector('#updateModalLabel').textContent =
							'Update product sucess';
					}
				} catch (e) {
					console.error(e.message);
				}
			});
		});
	});
});

async function getWarehouse(token, searchDetail) {
	try {
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ search: searchDetail }),
		};
		const res = await fetch(`/protected/?token=${token}`, requestOptions);
		return await res.json();
	} catch (e) {}
}

function clearTableDisplay() {
	const table = document.getElementById('myTable');
	while (table.firstChild) {
		table.removeChild(table.firstChild);
	}
}

async function renderDisplay(token, searchDetail = null) {
	const whData = await getWarehouse(token, searchDetail);
	const table = document.getElementById('myTable');
	const tableHeader = document.createElement('tr');
	tableHeader.classList.add('header');
	const headers = ['Name', 'Address', 'City', 'Province', 'Volume', 'Action'];
	for (const i in 3) {
		const column = document.createElement('col');
		column.setAttribute('width', '20%');
		tableHeader.appendChild(column);
	}
	for (const i in 3) {
		const column = document.createElement('col');
		column.setAttribute('width', '20px');
		tableHeader.appendChild(column);
	}

	headers.forEach((header) => {
		const h = document.createElement('th');
		h.textContent = header;
		tableHeader.appendChild(h);
	});

	table.appendChild(tableHeader);

	whData.forEach((warehouse) => {
		const table_row = document.createElement('tr');
		table_row.id = `${warehouse.id}`;

		const whName = document.createElement('td');
		whName.innerText = `${warehouse.name}`;

		const whAddress = document.createElement('td');
		whAddress.innerText = `${warehouse.address}`;

		const whCity = document.createElement('td');
		whCity.innerText = `${warehouse.city}`;

		const whProvince = document.createElement('td');
		whProvince.innerText = `${warehouse.province}`;

		const whVolume = document.createElement('td');
		whVolume.innerText = `${warehouse.fillVolume}/${warehouse.volume}`;

		const whModify = document.createElement('td');
		whModify.innerHTML += `<button type="button" class="btn btn-primary btn-sm update-product" data-toggle="modal" data-target="#updateModal" data-id="${warehouse.id}" data-name="${warehouse.name}" data-address=" ${warehouse.address}" data-city=" ${warehouse.city}" data-province=" ${warehouse.province}" data-volume ="${warehouse.volume}">Update</button>`;

		whModify.innerHTML +=
			'<button type="button" class="btn btn-primary btn-sm btn-danger" data-toggle="modal" data-target="#deleteModal">Delete</button>';

		table_row.append(
			whName,
			whAddress,
			whCity,
			whProvince,
			whVolume,
			whModify
		);
		table.appendChild(table_row);
	});
}
