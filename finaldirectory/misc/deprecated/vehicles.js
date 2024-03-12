// Wait until DOM content has been fully loaded prior to the execution of js code
document.addEventListener('DOMContentLoaded', function() {
    // Grab vehicles list element from HTML doc
    var vehiclesList = document.getElementById('vehicles-list');
    
    // Add the 'click' event listener to handle any 'click' action from user
    vehiclesList.addEventListener('click', function(event) {
        // Check if the clicked element is a list type
        if (event.target.tagName === 'LI') {
            var vehiclesName = event.target.dataset.vehicles;
	    // Call function that displays vehicles information on click
            toggleVehiclesInformation(vehiclesName, event.target);
        }
    });
    
    // Get the search input item from the HTML doc 
    var searchInput = document.getElementById('search');

    // Add event listener for the search action 
    searchInput.addEventListener('input', function() {
        var searchValue = searchInput.value.toLowerCase();
        // Get all items that are of type list from the page
        var vehiclesItems = vehiclesList.querySelectorAll('li');

        vehiclesItems.forEach(function(item) {
            var vehiclesName = item.dataset.vehicles.toLowerCase();
            // Check if the character name includes the search value
            if (vehiclesName.includes(searchValue)) {
                // If the vehicle name matches the search value, show the list item
                item.style.display = 'block';
            } else {
                // If the vehicle name does not match the search value, hide the list item
                item.style.display = 'none';
                // Check if there is an info box associated with the list item
                var infoBox = item.nextElementSibling;
                if (infoBox && infoBox.classList.contains('info-box')) {
                    // If an info box exists, remove it
                    infoBox.remove();
                }
            }
        });
    });

    // Function to fetch vehicle data from our database
    function fetchVehiclesInformation(vehiclesName, targetElement) {
        fetch('/vehicles-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                vehicles: vehiclesName
            })
        })
        .then(response => response.json())
        .then(data => {
            // Call function to display vehicles information
            displayVehiclesInformation(data, targetElement);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Function to check if info box exists for vehicles upon click
    function toggleVehiclesInformation(vehiclesName, targetElement) {
	// Grab the next item of the element that has been clicked
        var existingInfoBox = targetElement.nextElementSibling;
	// Check if that item already displays its info box
        if (existingInfoBox && existingInfoBox.classList.contains('info-box')) {
            // If an info box exists, remove it
            existingInfoBox.remove();
        } else {
            // If an info box does not exist, display the info box
            fetchVehiclesInformation(vehiclesName, targetElement);
        }
    }

    // Function to display vehicles information upon toggle
    function displayVehiclesInformation(vehiclesInfo, targetElement) {
        // Create a formatted string with the vehicles information
        var formattedInfo = `
            <p><strong>Name:</strong> ${vehiclesInfo[0]}</p>
            <p><strong>Model:</strong> ${vehiclesInfo[1]}</p>
            <p><strong>Manufacturer:</strong> ${vehiclesInfo[2]}</p>
            <p><strong>Cost (credits):</strong> ${vehiclesInfo[3]}</p>
            <p><strong>Length (meters):</strong> ${vehiclesInfo[4]}</p>
            <p><strong>Max Atmosphering Speed (km/h):</strong> ${vehiclesInfo[5]}</p>
            <p><strong>Crew:</strong> ${vehiclesInfo[6]}</p>
            <p><strong>Passengers:</strong> ${vehiclesInfo[7]}</p>
            <p><strong>Cargo Capacity (kg):</strong> ${vehiclesInfo[8]}</p>
            <p><strong>Consumables:</strong> ${vehiclesInfo[9]}</p>
            <p><strong>Class:</strong> ${vehiclesInfo[10]}</p>
        `;

        // Create a div element for the info box
        var infoBox = document.createElement('div');
        infoBox.classList.add('info-box');
        infoBox.dataset.vehicles = vehiclesInfo.name;
        // Set the HTML content of the info box to the formatted character information
        infoBox.innerHTML = formattedInfo;

        //Insert the info box after the target element
        targetElement.insertAdjacentElement('afterend', infoBox);
    }
});
