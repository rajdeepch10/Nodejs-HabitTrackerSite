function itemTemplate(item) {
	if (item.status == 'Pending') {
		return `
	<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
	<span class="item-text">${item.habit}</span>
	<div>
	<button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Done Today</button>
	<button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
	</div>
	</li>`;
	} else {
		return `
	<li style="text-decoration:line-through;" class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
	<span class="item-text">${item.habit}</span>
	<div>
	<button data-id="${item._id}"  class="edit-me btn btn-secondary btn-sm mr-1">Done Today</button>
	<button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
	</div>
	</li>`;
	}
}

let ourHTML = items
	.map(function(item) {
		return itemTemplate(item);
	})
	.join('');
// Initial Page load render
document.getElementById('item-list').insertAdjacentHTML('beforeend', ourHTML);

let createField = document.getElementById('create-field');
document.getElementById('create-form').addEventListener('submit', function(e) {
	e.preventDefault();
	console.log(createField.value);
	axios
		.post('/add-habit', { habit: createField.value })
		.then(function(response) {
			document.getElementById('item-list').insertAdjacentHTML('beforeend', itemTemplate(response.data));
			createField.value = '';
			createField.focus();
		})
		.catch(function() {
			console.log('Please try again.');
		});
});

document.addEventListener('click', function(e) {
	//Delete habit
	if (e.target.classList.contains('delete-me')) {
		axios
			.post('delete-habit', { id: e.target.getAttribute('data-id') })
			.then(e.target.parentElement.parentElement.remove())
			.catch(function() {
				console.log('Please try again');
			});
	}

	//Update item
	if (e.target.classList.contains('edit-me')) {
		axios
			.post('update-habit', { id: e.target.getAttribute('data-id'), status: 'done' })
			.then((e.target.parentElement.parentElement.style.textDecoration = 'line-through'))
			.catch(function() {
				console.log('Please try again');
			});
	}
});
