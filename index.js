// add event listener that waits for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Fetch the data from db.json
    // get car details to display available cars in stock
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
                let carImage = document.createElement('img');
                carImage.src = car.image;
                carImage.alt = car.model;
                carDiv.appendChild(carImage);

                // Add the car model
                const carModel = document.createElement('h4');
                carModel.textContent = car.model;
                // console.log(carModel)
                carDiv.appendChild(carModel);

                // Add the year of manufacture
                let carYear = document.createElement('p');
                carYear.textContent = `Year of Manufacture: ${car.yearOfManufacture}`;
                carDiv.appendChild(carYear);

                // Append the carDiv to the carDisplayContainer
                carDisplayContainer.appendChild(carDiv);
            });
        })
        .catch(error => console.error('Error fetching cars:', error));
     
        //fetch and add car details by search make 
        fetch("http://localhost:3000/cars")
                .then(response => response.json()) //parse JSON from the response
                .then(data => {
                    const makeDropdown = document.querySelector('.car-make-dropdown');
                    const carMakes = new Set(data.map(car => car.model)); 
                    // Iterate through each make in the car data
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
                const searchByMakeButton = document.getElementById('searchByMake');//access the node
                const carDropdown = document.getElementById('make-dropdown');
                // add event listener
                searchByMakeButton.addEventListener('click', function() {
                    const selectedMake = carDropdown.value;
                    // console.log(selectedMake)
                    //fetch by make from db.json
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
            
                // Fetch and display international Cars
    
    const internationalCarsDiv = document.getElementById('internationalCars');

    // Function to fetch international cars and display them
    function fetchInternationalCars() {
        // fetch import cars from db.json
        fetch("http://localhost:3000/importCars")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();//parse JSON
            })
            .then(cars => {
                displayInternationalCars(cars);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                internationalCarsDiv.innerHTML = `<p>Error loading cars: ${error.message}</p>`;
            });
    }

    // Call the fetch function when the international stock section is hovered over
    document.getElementById('international-stock').addEventListener('mouseover', fetchInternationalCars);
});

// Function to display international cars
function displayInternationalCars(cars) {
    const internationalCarsDiv = document.getElementById('internationalCars');
    internationalCarsDiv.innerHTML = ''; // Clear previous content
    // loop through each car in the data
    cars.forEach(car => {
        let carDiv = document.createElement('div');
        carDiv.className = 'car-info';
        carDiv.innerHTML = `
            <img src="${car.image}" alt="${car.model}" class="img-fluid">
            <p>Model: ${car.model}</p>
            <p>Year: ${car.yearOfManufacture}</p>
            <p>Price: $${car.price.toLocaleString()}</p>
            <p>Location: ${car.location}</p>
        `;
        internationalCarsDiv.appendChild(carDiv);
    });

}
   // Handle star rating
const stars = document.querySelectorAll('.star');//access the element
let currentRating = 0;//set the initial rating to zero
// loop through the stars
stars.forEach(star => {
    star.addEventListener('click', function() {
        currentRating = parseInt(this.getAttribute('data-value'));
        updateStars(currentRating);
    });
});
// a fumction to update the stars
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
// edit revise comment
function editFeedback(id) {
    const newName = prompt("Enter new name:");
    const newComment = prompt("Enter new comment:");
    const newRating = parseInt(prompt("Enter new rating (1-5):"));

    if (newName && newComment && !isNaN(newRating)) {
        const updatedData = {
            name: newName,
            comment: newComment,
            rating: newRating
        };

        fetch(`http://localhost:3000/ratings/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Feedback updated successfully:', data);
            // Update the feedback display on the page
            const feedbackElement = document.getElementById(id);
            feedbackElement.innerHTML = `
                <div id =${data.id}>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Rating:</strong> ${generateStars(data.rating)}</p>
                <p><strong>Comment:</strong> ${data.comment}</p>
               <p><button onclick ="editFeedback(${data.id})">Edit this comment</button></p>
               <p> <button  class ="delete-button" onclick= "deleteFeedback(${data.id})">Delete</button></p>
               </div>
            `;
        })
        .catch(error => console.error('Error updating feedback:', error));
    } else {
        alert('Please fill all fields correctly.');
    }
}


//  delete a comment
function deleteFeedback(id){
    // console.log(id)
    fetch(`http://localhost:3000/ratings/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            const feedbackElement = document.getElementById(id);
            feedbackElement.remove();
            console.log('Feedback deleted successfully');
        }
    })
    .catch(error => console.error('Error deleting feedback:', error));
}
// add event
document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const comment = document.getElementById('comment').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
// add a conditional statement to check if everything is present
    if (comment && currentRating > 0 && name && email) {
        const data = {
            rating: currentRating,
            comment: comment,
            name: name,
            email: email
        };

        // Send the data to the backend using POST method
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
                <div id =${data.id}>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Rating:</strong> ${generateStars(data.rating)}</p>
                <p><strong>Comment:</strong> ${data.comment}</p>

               <p><button onclick ="editFeedback(${data.id})">Edit this comment</button></p>
               <p> <button  class ="delete-button" onclick= "deleteFeedback(${data.id})">Delete</button></p>
               </div>
            `;
           
            feedbackContainer.appendChild(newFeedback);

            // Clear the form fields
            document.getElementById('comment').value = '';
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';

            // Optionally, display a success message or handle redirection
            // console.log('Feedback submitted successfully:', data);//test whether data is successfully sent
        })
        .catch(error => {
            // Handle errors
            console.error('Error submitting feedback:', error);
        });
    } else {
        alert('Please fill in all fields and select a rating.');
    }
});
// add an event listener to submit the comments
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
console.log('Form-submitted')
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const message = document.getElementById('message').value;

    // Debugging line to see whether values are being captured
    console.log('Name:', userName); // Log to check the value of the name field
    console.log('Email:', userEmail); // Log to check the value of the email field
    console.log('Message:', message); // Log to check the value of the message field

//    feedback section
// code to send customer message after reviewing
// a conditional statement to check whether all attributes are present
    if (userName && userEmail && message) {
        const feedbackData = {
            yourName: userName,
            yourEmail: userEmail,
            comment: message,
        };
// debug to see whether data is captured and can be send
        console.log('Data ready to send:', feedbackData); 
  fetch('http://localhost:3000/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept':'application/json'
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
            // debugging line
            // console.log('Feedback submitted successfully:', data);
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

    // To update the comments by the user using PATCH
    
// To enable delete by User on a specific comment


// Toggling
// to effect the toggle theme
   const themeToggleButton = document.getElementById('theme-toggle');// access the toggle button
    const currentTheme = localStorage.getItem('theme');

    // Apply the saved theme on reload
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    themeToggleButton.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        
        // Save the current theme to localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    
    });


})
    