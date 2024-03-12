// Wait until DOM content has been fully loaded prior to the execution of js code
document.addEventListener('DOMContentLoaded', function() {
    // Grab species list element from HTML doc
    var starshipsList = document.getElementById('starships-list');
    
    // Add the 'click' event listener to handle any 'click' action from user
    starshipsList.addEventListener('click', function(event) {
        // Check if the clicked element is a list type
        if (event.target.tagName === 'LI') {
            var starshipName = event.target.dataset.starships;
	    // Call function that displays species information on click
            toggleStarshipInformation(starshipName, event.target);
        }
    });
    
    // Get the search input item from the HTML doc 
    var searchInput = document.getElementById('search');

    // Add event listener for the search action 
    searchInput.addEventListener('input', function() {
        var searchValue = searchInput.value.toLowerCase();
        // Get all items that are of type list from the page
        var starshipsItems = starshipsList.querySelectorAll('li');

        starshipsItems.forEach(function(item) {
            var starshipName = item.dataset.starships.toLowerCase();
            // Check if the species name includes the search value
            if (starshipName.includes(searchValue)) {
                // If the species name matches the search value, show the list item
                item.style.display = 'block';
            } else {
                // If the species name does not match the search value, hide the list item
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

    // Function to fetch species data from our database
    function fetchStarshipInformation(starshipName, targetElement) {
        fetch('/starships-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                starships: starshipName
            })
        })
        .then(response => response.json())
        .then(data => {
            // Call function to display species information
            displayStarshipInformation(data, targetElement);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Function to check if info box exists for species upon click
    function toggleStarshipInformation(starshipName, targetElement) {
	// Grab the next item of the element that has been clicked
        var existingInfoBox = targetElement.nextElementSibling;
	// Check if that item already displays its info box
        if (existingInfoBox && existingInfoBox.classList.contains('info-box')) {
            // If an info box exists, remove it
            existingInfoBox.remove();
        } else {
            // If an info box does not exist, display the info box
            fetchStarshipInformation(starshipName, targetElement);
        }
    }

    // Function to display starships information upon toggle
    function displayStarshipInformation(starshipsInfo, targetElement) {
        // Create a formatted string with the starships information
        var formattedInfo = `
            <p><strong>Model:</strong> ${starshipsInfo[1]}</p>
            <p><strong>Manufacturer:</strong> ${starshipsInfo[2]}</p>
            <p><strong>Cost:</strong> ${starshipsInfo[3]}</p>
            <p><strong>Length:</strong> ${starshipsInfo[4]}</p>
            <p><strong>Maximum Atmosphering Speed:</strong> ${starshipsInfo[5]}</p>
            <p><strong>Crew:</strong> ${starshipsInfo[6]}</p>
            <p><strong>Passengers:</strong> ${starshipsInfo[7]}</p>
            <p><strong>Cargo Capacity:</strong> ${starshipsInfo[8]}</p>
            <p><strong>Consumables:</strong> ${starshipsInfo[9]}</p>
            <p><strong>Hyperdriving Rating:</strong> ${starshipsInfo[10]}</p>
            <p><strong>mglt:</strong> ${starshipsInfo[11]}</p>
            <p><strong>Starship Class:</strong> ${starshipsInfo[12]}</p>
        `;

        // Create a div element for the info box
        var infoBox = document.createElement('div');
        infoBox.classList.add('info-box');
        infoBox.dataset.starships = starshipsInfo.name;
        // Set the HTML content of the info box to the formatted species information
        infoBox.innerHTML = formattedInfo;

        // Insert the info box after the target element
        targetElement.insertAdjacentElement('afterend', infoBox);
    }

});

