document.addEventListener('DOMContentLoaded', function() {
    // Fetch the data from db.json
    fetch("http://localhost:3000/cars") 
        .then(response => response.json()) // Parse the JSON from the response
        .then(data => {
            console.log(data)
            // Get the car display container
            const carDisplayContainer = document.querySelector('.car-display-container');

            // Loop through each car in the data
            data.forEach(car => {
                // Create a div to hold the car details
                const carDiv = document.createElement('div');
                carDiv.classList.add('car');

                // Add the car image
                const carImage = document.createElement('img');
                carImage.src = car.image;
                carImage.alt = car.model;
                carDiv.appendChild(carImage);

                // Add the car model
                const carModel = document.createElement('h4');
                carModel.textContent = car.model;
                carDiv.appendChild(carModel);

                // Add the year of manufacture
                const carYear = document.createElement('p');
                carYear.textContent = `Year of Manufacture: ${car.yearOfManufacture}`;
                carDiv.appendChild(carYear);

                // Append the carDiv to the carDisplayContainer
                carDisplayContainer.appendChild(carDiv);
            });
        })
        .catch(error => console.error('Error fetching cars:', error));

            fetch("http://localhost:3000/cars")
                .then(response => response.json())
                .then(data => {
                    const makeDropdown = document.querySelector('.car-make-dropdown');
                    const carMakes = new Set(data.map(car => car.model)); // This removes any duplicates
        console.log(carMakes)
                    carMakes.forEach(make => {
                        const option = document.createElement('option');
                        option.value = make;
                        option.textContent = make;
                        makeDropdown.appendChild(option);
                    });
                })
                .catch(error => console.error('Error fetching car makes:', error));

            
});
