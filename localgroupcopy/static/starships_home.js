document.addEventListener('DOMContentLoaded', () => {
    const starshipsList = document.getElementById('starships-list');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const filterBtn = document.getElementById('filter-btn');
    const minCargoCapacityInput = document.getElementById('min-cargo-capacity');
    const maxCargoCapacityInput = document.getElementById('max-cargo-capacity');
    let starships = []; // Array to store fetched starships

    // Fetch starships from the API
    function fetchStarships() {
        fetch('/api/starships')
            .then(response => response.json())
            .then(data => {
                starships = data; // Store fetched starships
                displayStarships(starships); // Display all starships initially
            })
            .catch(error => console.error('Error fetching starships:', error));
    }

    // Display starships in the UI
    function displayStarships(starshipsToDisplay) {
        starshipsList.innerHTML = ''; // Clear the list first
        starshipsToDisplay.forEach(starship => {
            const listItem = document.createElement('li');
            listItem.textContent = starship.name;
            listItem.setAttribute('data-starship-id', starship.id);
            listItem.addEventListener('click', () => displayStarshipDetails(starship.id));
            starshipsList.appendChild(listItem);
        });
    }

    // Display details of a starship
    function displayStarshipDetails(starshipId) {
        const starship = starships.find(s => s.id === starshipId);
        if (starship) {
            console.log(`Displaying details for: ${starship.name}`);
            // Implement the actual detail display logic here
        }
    }

    // Search functionality
    function searchStarships() {
        const searchText = searchInput.value.toLowerCase();
        const filteredStarships = starships.filter(starship => starship.name.toLowerCase().includes(searchText));
        displayStarships(filteredStarships);
    }

    // Filter functionality
    function filterStarships() {
        const minCargoCapacity = parseInt(minCargoCapacityInput.value, 10) || 0;
        const maxCargoCapacity = parseInt(maxCargoCapacityInput.value, 10) || Infinity;
        const filteredStarships = starships.filter(starship => {
            const cargoCapacity = parseInt(starship.cargo_capacity, 10) || 0;
            return cargoCapacity >= minCargoCapacity && cargoCapacity <= maxCargoCapacity;
        });
        displayStarships(filteredStarships);
    }

    // Event listeners
    searchBtn.addEventListener('click', searchStarships);
    filterBtn.addEventListener('click', filterStarships);

    // Initial fetch of starships
    fetchStarships();
});
