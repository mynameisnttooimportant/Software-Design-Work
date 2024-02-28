document.addEventListener('DOMContentLoaded', function() {
    var starshipsList = document.getElementById('starships-list');
    var searchInput = document.getElementById('search');
    var filterBtn = document.getElementById('filter-btn');
    var minCargoCapacity = document.getElementById('min-cargo-capacity');
    var maxCargoCapacity = document.getElementById('max-cargo-capacity');

    // Event listener for click actions within the starships list
    starshipsList.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            var starshipName = event.target.dataset.starships;
            toggleStarshipInformation(starshipName, event.target);
        }
    });

    // Event listener for the search functionality
    searchInput.addEventListener('input', function() {
        applyFilters();
    });

    // Event listener for the filter button to apply cargo capacity filters
    filterBtn.addEventListener('click', function() {
        applyFilters();
    });

    // Apply both search and filter criteria
    function applyFilters() {
        var searchValue = searchInput.value.toLowerCase();
        fetch('/starships-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                search: searchValue,
                minCargoCapacity: minCargoCapacity.value || 0,
                maxCargoCapacity: maxCargoCapacity.value || Number.MAX_SAFE_INTEGER
            })
        })
        .then(response => response.json())
        .then(data => {
            updateStarshipsList(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Update the starships list based on the fetched data
    function updateStarshipsList(data) {
        starshipsList.innerHTML = ''; // Clear the current list
        data.forEach(starship => {
            var li = document.createElement('li');
            li.textContent = starship.name; // Assuming 'name' is a property of your data
            li.dataset.starships = starship.name; // Store the starship name for search
            li.dataset.cargoCapacity = starship.cargo_capacity; // Store cargo capacity for filtering
            starshipsList.appendChild(li);
        });
    }

    // Toggle the display of starship information
    function toggleStarshipInformation(starshipName, targetElement) {
        var existingInfoBox = targetElement.nextElementSibling;
        if (existingInfoBox && existingInfoBox.classList.contains('info-box')) {
            existingInfoBox.remove();
        } else {
            fetchStarshipInformation(starshipName, targetElement);
        }
    }

    // Fetch detailed starship information
    function fetchStarshipInformation(starshipName, targetElement) {
        // This example assumes the starship's detailed information is fetched based on its name.
        // You might need to adjust it to use an ID or another identifier if necessary.
        fetch('/starships-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ starships: starshipName })
        })
        .then(response => response.json())
        .then(data => {
            displayStarshipInformation(data, targetElement);
        })
        .catch(error => {
            console.error('Error fetching starship information:', error);
        });
    }

    // Display starship information
    function displayStar
