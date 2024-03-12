// Wait until DOM content has been fully loaded prior to the execution of js code
document.addEventListener('DOMContentLoaded', function() {
    // Grab species list element from HTML doc
    var speciesList = document.getElementById('species-list');
    
    // Add the 'click' event listener to handle any 'click' action from user
    speciesList.addEventListener('click', function(event) {
        // Check if the clicked element is a list type
        if (event.target.tagName === 'LI') {
            var speciesName = event.target.dataset.species;
	    // Call function that displays species information on click
            toggleSpeciesInformation(speciesName, event.target);
        }
    });
    
    // Get the search input item from the HTML doc 
    var searchInput = document.getElementById('search');

    // Add event listener for the search action 
    searchInput.addEventListener('input', function() {
        var searchValue = searchInput.value.toLowerCase();
        // Get all items that are of type list from the page
        var speciesItems = speciesList.querySelectorAll('li');

        speciesItems.forEach(function(item) {
            var speciesName = item.dataset.species.toLowerCase();
            // Check if the species name includes the search value
            if (speciesName.includes(searchValue)) {
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
    function fetchSpeciesInformation(speciesName, targetElement) {
        fetch('/species-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                species: speciesName
            })
        })
        .then(response => response.json())
        .then(data => {
            // Call function to display species information
            displaySpeciesInformation(data, targetElement);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Function to check if info box exists for species upon click
    function toggleSpeciesInformation(speciesName, targetElement) {
	// Grab the next item of the element that has been clicked
        var existingInfoBox = targetElement.nextElementSibling;
	// Check if that item already displays its info box
        if (existingInfoBox && existingInfoBox.classList.contains('info-box')) {
            // If an info box exists, remove it
            existingInfoBox.remove();
        } else {
            // If an info box does not exist, display the info box
            fetchSpeciesInformation(speciesName, targetElement);
        }
    }

    // Function to display species information upon toggle
    function displaySpeciesInformation(speciesInfo, targetElement) {
        var infoBox = document.createElement('div');
        infoBox.classList.add('info-box');
        infoBox.dataset.species = speciesInfo.name;
        infoBox.textContent = `Info: ${speciesInfo}`;
        targetElement.insertAdjacentElement('afterend', infoBox);
    }
});

