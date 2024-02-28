document.addEventListener('DOMContentLoaded', function() {
    const starshipsList = document.getElementById('starships-list');
    const searchInput = document.getElementById('search');
    const filterBtn = document.getElementById('filter-btn');
    const minCargoCapacity = document.getElementById('min-cargo-capacity');
    const maxCargoCapacity = document.getElementById('max-cargo-capacity');

    function fetchAndDisplayStarships() {
        const searchValue = searchInput.value.toLowerCase();
        const minCapacity = minCargoCapacity.value;
        const maxCapacity = maxCargoCapacity.value;

        fetch('/starships-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                search: searchValue,
                minCargoCapacity: minCapacity,
                maxCargoCapacity: maxCapacity
            })
        })
        .then(response => response.json())
        .then(data => displayStarships(data))
        .catch(error => console.error('Error:', error));
    }

    function displayStarships(starships) {
        starshipsList.innerHTML = ''; // Clear current list
        starships.forEach(starship => {
            const li = document.createElement('li');
            li.textContent = starship.name; // Display starship name
            li.dataset.starships = starship.name; // for search and click functionality
            li.addEventListener('click', () => displayStarshipDetails(starship)); // Assuming starship object has all details needed
            starshipsList.appendChild(li);
        });
    }

    function displayStarshipDetails(starship) {
        alert(`Starship: ${starship.name}\nCargo Capacity: ${starship.cargo_capacity}`);
        // Replace this alert with a more sophisticated way of displaying details as needed
    }

    // Trigger fetching and displaying of starships on search input or filter button click
    searchInput.addEventListener('input', fetchAndDisplayStarships);
    filterBtn.addEventListener('click', fetchAndDisplayStarships);

    // Initial fetch to display starships
    fetchAndDisplayStarships();
});
