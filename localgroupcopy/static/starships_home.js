document.addEventListener('DOMContentLoaded', function() {
    var starshipsList = document.getElementById('starships-list');
    var searchInput = document.getElementById('search');
    var filterBtn = document.getElementById('filter-btn');
    var minCargoCapacity = document.getElementById('min-cargo-capacity');
    var maxCargoCapacity = document.getElementById('max-cargo-capacity');

    starshipsList.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            var starshipName = event.target.dataset.starships;
            toggleStarshipInformation(starshipName, event.target);
        }
    });

    searchInput.addEventListener('input', function() {
        fetchFilteredStarships();
    });

    filterBtn.addEventListener('click', function() {
        fetchFilteredStarships();
    });

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

    function updateStarshipsList(data) {
        starshipsList.innerHTML = '';
        data.forEach(starship => {
            var li = document.createElement('li');
            li.textContent = starship.name;
            li.dataset.starships = starship.name;
            starshipsList.appendChild(li);
        });
    }

    function toggleStarshipInformation(starshipName, targetElement) {
        var existingInfoBox = targetElement.nextElementSibling;
        if (existingInfoBox && existingInfoBox.classList.contains('info-box')) {
            existingInfoBox.remove();
        } else {
            fetchStarshipInformation(starshipName, targetElement);
        }
    }

    function fetchStarshipInformation(starshipName, targetElement) {
        // Fetching starship information remains the same
        // Implementation not repeated for brevity
    }

    function displayStarshipInformation(starshipsInfo, targetElement) {
        var infoBox = document.createElement('div');
        infoBox.classList.add('info-box');
        infoBox.dataset.starships = starshipsInfo.name;
        infoBox.textContent = `Info: ${JSON.stringify(starshipsInfo)}`; // Adjust based on your data structure
        targetElement.insertAdjacentElement('afterend', infoBox);
    }

    // Initial fetch to display starships based on default criteria
    fetchFilteredStarships();
});
