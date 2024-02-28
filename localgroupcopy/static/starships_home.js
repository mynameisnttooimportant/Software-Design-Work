document.addEventListener('DOMContentLoaded', function() {
    var starshipsList = document.getElementById('starships-list');
    var searchInput = document.getElementById('search');
    var filterBtn = document.getElementById('filter-btn');
    var minCargoCapacity = document.getElementById('min-cargo-capacity');
    var maxCargoCapacity = document.getElementById('max-cargo-capacity');

    // Event listener to handle click actions within the starships list
    starshipsList.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            var starshipName = event.target.dataset.starships;
            toggleStarshipInformation(starshipName, event.target);
        }
    });

    // Event listener for the search functionality
    searchInput.addEventListener('input', fetchFilteredStarships);

    // Event listener for the filter button to apply cargo capacity filters
    filterBtn.addEventListener('click', fetchFilteredStarships);

    // Fetches and displays starships based on search and filter criteria
    function fetchFilteredStarships() {
        var searchValue = searchInput.value.toLowerCase();
        var minCapacityValue = minCargoCapacity.value;
        var maxCapacityValue = maxCargoCapacity.value;

        fetch('/starships-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                search: searchValue,
                minCargoCapacity: minCapacityValue,
                maxCargoCapacity: maxCapacityValue
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

    // Updates the starships list based on fetched data
    function updateStarshipsList(data) {
        starshipsList.innerHTML = '';
        data.forEach(function(starship) {
            var li = document.createElement('li');
            li.textContent = starship.name;
            li.dataset.starships = starship.name;
            starshipsList.appendChild(li);
        });
    }

    // Toggles the display of detailed starship information
    function toggleStarshipInformation(starshipName, targetElement) {
        var existingInfoBox = targetElement.nextElementSibling;
        if (existingInfoBox && existingInfoBox.classList.contains('info-box')) {
            existingInfoBox.remove();
        } else {
            fetchStarshipInformation(starshipName, targetElement);
        }
    }

    // Fetches detailed information for a specific starship
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
            displayStarshipInformation(data, targetElement);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Displays detailed information for a specific starship
    function displayStarshipInformation(starshipsInfo, targetElement) {
        var infoBox = document.createElement('div');
        infoBox.classList.add('info-box');
        infoBox.dataset.starships = starshipsInfo.name;
        // Modify this line to display the information you want, such as name, model, etc.
        infoBox.textContent = `Info: ${JSON.stringify(starshipsInfo)}`; 
        targetElement.insertAdjacentElement('afterend', infoBox);
    }
});
