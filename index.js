document.addEventListener('DOMContentLoaded', function() {
    fetchCars();
});

function fetchCars() {
    // Assuming db.json is hosted on your server at this path
    fetch('/path/to/your/db.json')
        .then(response => response.json())
        .then(data => displayCars(data.cars))
        .catch(error => console.error('Error fetching cars:', error));
}

function displayCars(cars) {
    const container = document.querySelector('.car-display-container');

    // Clear previous content
    container.innerHTML = '';

    // Add a header
    const header = document.createElement('h2');
    header.textContent = 'View our car display';
    container.appendChild(header);

    cars.forEach(car => {
        const carElement = document.createElement('div');
        carElement.classList.add('car');

        const image = document.createElement('img');
        image.src = car.image;
        image.alt = `Image of ${car.model}`;
        image.classList.add('car-image');

        const model = document.createElement('h3');
        model.textContent = car.model;
        model