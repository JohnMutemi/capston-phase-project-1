document.addEventListener('DOMContentLoaded', function() {
    // Fetch the data from db.json
    fetch("http://localhost:3000/cars") 
        .then(response => response.json()) // Parse the JSON from the response
        .then(data => {
            // console.log(data)
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
                console.log(carModel)
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
                    const carMakes = new Set(data.map(car => car.model)); // This removes any duplicate
                    carMakes.forEach(make => {
                        const option = document.createElement('option');
                        option.value = make;
                        option.textContent = make;
                        makeDropdown.appendChild(option);
                    });
                })
                .catch(error => console.error('Error fetching car makes:', error));
               
                // to display car data based on the search by the user.
                const carDisplaySection = document.getElementById('filteredCarDisplay');
                // Fetch and display cars by make
                const searchByMakeButton = document.getElementById('searchByMake');
                const carDropdown = document.getElementById('make-dropdown');
                searchByMakeButton.addEventListener('click', function() {
                    const selectedMake = carDropdown.value;
                    // console.log(selectedMake)
                    fetch(`http://localhost:3000/cars?model=${selectedMake}`)
                        .then(response => response.json())
                         .then(cars => {
                            // console.log(cars)
                            let matchingCar = cars.find(car => car.model === selectedMake);
                            console.log(matchingCar)
                                displayCarData(matchingCar);

                        })
                        .catch(error => console.error('Error:', error));
                });
            
                // Fetch and display cars by price range
                const searchByPriceButton = document.getElementById('searchByPrice');
                const priceRangeDropdown = document.getElementById('priceRange');
                searchByPriceButton.addEventListener('click', function() {
                    const selectedRange = priceRangeDropdown.value.split('-').map(Number);
                    fetch(`http://localhost:3000/cars?price=${car.price}`)
                        .then(response => response.json())
                        .then(cars => {
                            let matchingCarByPrice = cars.find(car => car.price >= selectedRange[0] && car.price <= selectedRange[1]);
                            console.log(matchingCarByPrice)
                                displayCarData(matchingCarByPrice);
                        })
                        .catch(error => console.error('Error:', error));
                });
            
                // Function to display car data
                function displayCarData(car) {
                    // Create elements
                    const carContainer = document.createElement('div');
                    const carImage = document.createElement('img');
                    const modelParagraph = document.createElement('p');
                    const yearParagraph = document.createElement('p');
                    const priceParagraph = document.createElement('p');
                
                    // Set attributes and text content
                    carImage.src = car.image;
                    carImage.alt = 'Car Image';
                    carImage.style.width = '100%';
                    carImage.style.maxWidth = '300px';
                
                    modelParagraph.textContent = `Model: ${car.model}`;
                    yearParagraph.textContent = `Year of Manufacture: ${car.yearOfManufacture}`;
                    priceParagraph.textContent = `Price: ${car.price}`;
                
                    // Append elements to container
                    carContainer.appendChild(carImage);
                    carContainer.appendChild(modelParagraph);
                    carContainer.appendChild(yearParagraph);
                    carContainer.appendChild(priceParagraph);
                
                    // Append container to carDisplaySection
                    carDisplaySection.appendChild(carContainer);
                }
    

    // Handle star rating
    const stars = document.querySelectorAll('.star');
    let currentRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', function() {
           const currentRating = this.getAttribute('data-value');
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
            const data = {
                rating: currentRating,
                comment: comment
            };
    
            fetch('http://localhost:3000/cars', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept':'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    // Data successfully sent to server
                    // You can update UI accordingly if needed
                    console.log('Comment and rating submitted successfully.');
                    document.getElementById('comment').value = '';
                    updateStars(0); // Reset stars
                } else {
                    // Handle errors
                    console.error('Error submitting comment and rating:', response.status);
                    alert('Error submitting comment and rating. Please try again later.');
                }
            })
            .catch(error => {
                // Handle network errors
                console.error('Network error:', error);
                alert('Network error. Please try again later.');
            });
        } else {
            alert('Please leave a rating and a comment.');
        }
    });
})