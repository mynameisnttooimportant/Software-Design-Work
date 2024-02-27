document.addEventListener('DOMContentLoaded', function() {
    var starshipsList = document.getElementById('starships-list');
    var searchInput = document.getElementById('search');
    var filterBtn = document.getElementById('filter-btn');
    var minCargoCapacity = document.getElementById('min-cargo-capacity');
    var maxCargoCapacity = document.getElementById('max-cargo-capacity');

    function fetchStarships(criteria) {
        fetch('/starships-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(criteria)
        })
        .then(response => response.json())
        .then(data => {
            updateStarshipsList(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function updateStarshipsList(data) {
        starshipsList.innerHTML = ''; // Clear current list
        data.forEach(starship => {
            let li = document.createElement('li');
            li.textContent = starship.name; // Assuming 'name' is part of your data
            li.dataset.starshipId = starship.id; // Assuming 'id' is part of your data
            li.addEventListener('click', () => displayStarshipInfo(starship));
            starshipsList.appendChild(li);
        });
    }

    function displayStarshipInfo(starship) {
        // Implementation depends on how you want to display the detailed info
        console.log(starship); // For demonstration, just log the starship details
    }

    searchInput.addEventListener('input', function() {
        let criteria = {
            starships: searchInput.value,
            minCargoCapacity: minCargoCapacity.value || 0,
            maxCargoCapacity: maxCargoCapacity.value || Number.MAX_SAFE_INTEGER
        };
        fetchStarships(criteria);
    });

    filterBtn.addEventListener('click', function() {
        let criteria = {
            starships: searchInput.value,
            minCargoCapacity: minCargoCapacity.value || 0,
            maxCargoCapacity: maxCargoCapacity.value || Number.MAX_SAFE_INTEGER
        };
        fetchStarships(criteria);
    });
});
