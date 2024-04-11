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
                // console.log(carModel)
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
                    const carMakes = new Set(data.map(car => car.model)); 
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
                    fetch(`http://localhost:3000/cars?price=${selectedRange}`)
                        .then(response => response.json())
                        .then(cars => {
                            let matchingCarByPrice = cars.find(car => car.price >= selectedRange[0] && car.price <= selectedRange[1]);
                            // console.log(matchingCarByPrice)
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
        currentRating = parseInt(this.getAttribute('data-value'));
        updateStars(currentRating);
    });
});

function updateStars(rating) {
    stars.forEach(star => {
        if (parseInt(star.getAttribute('data-value')) <= rating) {
            star.textContent = '★';
        } else {
            star.textContent = '☆';
        }
    });
}

// Function to generate a string of stars based on rating
function generateStars(rating) {
    let stars = '';
    for(let i = 0; i < 5; i++) {
        stars += i < rating ? '★' : '☆';
    }
    return stars;
}

document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const comment = document.getElementById('comment').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (comment && currentRating > 0 && name && email) {
        const data = {
            rating: currentRating,
            comment: comment,
            name: name,
            email: email
        };

        // Send the data to the backend
        fetch('http://localhost:3000/ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            // Append new feedback to existing comments
            const feedbackContainer = document.getElementById('previous-ratings');
            const newFeedback = document.createElement('div');
            newFeedback.classList.add('testimonial');
            newFeedback.innerHTML = `
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Rating:</strong> ${generateStars(data.rating)}</p>
                <p><strong>Comment:</strong> ${data.comment}</p>
            `;
            feedbackContainer.appendChild(newFeedback);

            // Clear the form fields
            document.getElementById('comment').value = '';
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';

            // Optionally, display a success message or handle redirection
            console.log('Feedback submitted successfully:', data);
        })
        .catch(error => {
            // Handle errors
            console.error('Error submitting feedback:', error);
        });
    } else {
        alert('Please fill in all fields and select a rating.');
    }
});

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
console.log('Form-submitted')
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const message = document.getElementById('message').value;

    console.log('Name:', userName); // Log to check the value of the name field
    console.log('Email:', userEmail); // Log to check the value of the email field
    console.log('Message:', message); // Log to check the value of the message field

   // Debugging line to see what values are being captured

    if (userName && userEmail && message) {
        const feedbackData = {
            yourName: userName,
            yourEmail: userEmail,
            comment: message,
        };

        console.log('Data ready to send:', feedbackData); // Another debugging line

        fetch('http://localhost:3000/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            console.log('Feedback submitted successfully:', data);
            document.getElementById('contactForm').reset();
            alert('Thank you for your message!');
        })
        .catch(error => {
            console.error('Error submitting feedback:', error);
            alert('There was a problem with your submission. Please try again.');
        });
    }
     else {
        console.log('Validation failed.'); // Indicates which part of the code is being executed
        alert('Please fill in all fields.');
    }
});
})


    