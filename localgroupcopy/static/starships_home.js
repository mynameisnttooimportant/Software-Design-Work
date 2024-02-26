document.addEventListener('DOMContentLoaded', function() {
    var starshipsList = document.getElementById('starships-list');
    var searchInput = document.getElementById('search');
    var filterBtn = document.getElementById('filter-btn');
    var minCargoCapacityInput = document.getElementById('min-cargo-capacity');
    var maxCargoCapacityInput = document.getElementById('max-cargo-capacity');

    // Function to display starship information
    function displayStarshipInformation(starshipsInfo, targetElement) {
        var infoBox = document.createElement('div');
        infoBox.classList.add('info-box');
        // Assuming starshipsInfo is an object with a name property
        infoBox.textContent = `Info: Name: ${starshipsInfo.name}, Cargo Capacity: ${starshipsInfo.cargo_capacity}`;
        targetElement.insertAdjacentElement('afterend', infoBox);
    }

    // Function to fetch and display starship information based on cargo capacity
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

            // Assuming data is an array of starship objects
            data.forEach(starship => {
                var listItem = document.createElement('li');
                listItem.textContent = starship.name; // Adjust based on your data structure
                listItem.dataset.starships = starship.name;
                starshipsList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Event listener for the filter button
    filterBtn.addEventListener('click', function() {
        var searchValue = searchInput.value.toLowerCase();
        var minCargoCapacity = minCargoCapacityInput.value;
        var maxCargoCapacity = maxCargoCapacityInput.value;
        fetchStarshipInformationWithCargoCapacity(searchValue, minCargoCapacity, maxCargoCapacity);
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
        var searchValue = searchInput.value.toLowerCase();
        var starshipsItems = starshipsList.querySelectorAll('li');

        starshipsItems.forEach(function(item) {
            var starshipName = item.dataset.starships.toLowerCase();
            if (starshipName.includes(searchValue)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Click event listener for list items
    starshipsList.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            var starshipName = event.target.dataset.starships;
            // Display starship information on click, if needed
            // You might want to adjust this part based on how you want to handle the click event
            console.log(`Starship clicked: ${starshipName}`);
            // Optionally, call displayStarshipInformation or another function here
        }
    });
});
