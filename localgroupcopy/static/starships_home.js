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

    // Function to display species information upon toggle
    function displayStarshipInformation(starshipsInfo, targetElement) {
        var infoBox = document.createElement('div');
        infoBox.classList.add('info-box');
        infoBox.dataset.starships = starshipsInfo.name;
        infoBox.textContent = `Info: ${starshipsInfo}`;
        targetElement.insertAdjacentElement('afterend', infoBox);
    }

    document.addEventListener('DOMContentLoaded', function() {
        var filterBtn = document.getElementById('filter-btn');
        var searchInput = document.getElementById('search');
    
        filterBtn.addEventListener('click', function() {
            var searchValue = searchInput.value.toLowerCase();
            var minCargoCapacity = document.getElementById('min-cargo-capacity').value;
            var maxCargoCapacity = document.getElementById('max-cargo-capacity').value;
    
            fetchStarshipInformationWithCargoCapacity(searchValue, minCargoCapacity, maxCargoCapacity);
        });

        function fetchStarshipInformationWithCargoCapacity(starshipName, minCargo, maxCargo) {
            fetch('/starships-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    starships: starshipName,
                    minCargoCapacity: minCargo || 0, // Default to 0 if empty
                    maxCargoCapacity: maxCargo || Number.MAX_SAFE_INTEGER // Use a large number if empty
                })
            })
            .then(response => response.json())
            .then(data => {
                // Clear existing items
                while (starshipsList.firstChild) {
                    starshipsList.removeChild(starshipsList.firstChild);
                }
        
                // Assuming data is an array of objects, each with a 'name' property
                data.forEach(starship => {
                    var listItem = document.createElement('li');
                    listItem.textContent = starship.name; // Make sure 'name' matches your data structure
                    listItem.dataset.starships = starship.name;
                    listItem.addEventListener('click', function() {
                        // Implement what should happen when a starship is clicked
                        // For example, call a function to display more details about this starship
                        console.log(`Starship clicked: ${starship.name}`);
                    });
                    starshipsList.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        
    });
    

});

