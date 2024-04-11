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
               
                // to display car data based on the search by the user.

                const searchByMakeButton = document.getElementById('searchByMake');
                const carDropdown = document.getElementById('make-dropdown');
                const searchByPriceButton = document.getElementById('searchByPrice');
                const priceRangeDropdown = document.getElementById('priceRange');
                const carDisplaySection = document.getElementById('filteredCarDisplay');
            
                // Fetch and display cars by make
                searchByMakeButton.addEventListener('click', function() {
                    const selectedMake = carDropdown.value;
                    fetch('http://localhost:3000/cars')
                        .then(response => response.json())
                        .then(cars => {
                            let matchingCar = cars.find(car => car.model === selectedMake);
                            if(matchingCar) {
                                displayCarData(matchingCar);
                            } else {
                                carDisplaySection.innerText = 'No car found with the selected make.';
                            }
                        })
                        .catch(error => console.error('Error:', error));
                });
            
                // Fetch and display cars by price range
                searchByPriceButton.addEventListener('click', function() {
                    const selectedRange = priceRangeDropdown.value.split('-').map(Number);
                    fetch('http://localhost:3000/cars')
                        .then(response => response.json())
                        .then(cars => {
                            let matchingCar = cars.find(car => car.price >= selectedRange[0] && car.price <= selectedRange[1]);
                            if(matchingCar) {
                                displayCarData(matchingCar);
                            } else {
                                carDisplaySection.innerText = 'No car found within the selected price range.';
                            }
                        })
                        .catch(error => console.error('Error:', error));
                });
            
                // Function to display car data
                function displayCarData(car) {
                    carDisplaySection.innerHTML = `
                        <img src="${car.image}" alt="Car Image" style="width:100%; max-width:300px;">
                        <p>Model: ${car.model}</p>
                        <p>Year of Manufacture: ${car.yearOfManufacture}</p>
                        <p>Price: ${car.price}</p>
                    `;
                }
            });

    // Handle star rating
    const stars = document.querySelectorAll('.star');
    let currentRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', function() {
            currentRating = this.getAttribute('data-value');
            updateStars(currentRating);
        });
    });

    function updateStars(rating) {
        stars.forEach(star => {
            if(star.getAttribute('data-value') <= rating) {
                star.textContent = '★';
            } else {
                star.textContent = '☆';
            }
        });
    }

    // Handle comment submission
    document.getElementById('submitComment').addEventListener('click', function() {
        const comment = document.getElementById('comment').value;
        if (currentRating > 0 && comment) {
            // Display or process the comment and rating
            console.log(`Rating: ${currentRating} stars, Comment: ${comment}`);
            // Reset after submission
            document.getElementById('comment').value = '';
            updateStars(0); // Reset stars
        } else {
            alert('Please leave a rating and a comment.');
        }
    });

