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
        filterStarships();
    });

    filterBtn.addEventListener('click', function() {
        filterStarships();
    });

    function filterStarships() {
        var searchValue = searchInput.value.toLowerCase();
        var minCapacityValue = minCargoCapacity.value;
        var maxCapacityValue = maxCargoCapacity.value;

        // Assuming all list items are initially displayed, filter them based on the input and cargo capacity
        var starshipsItems = starshipsList.querySelectorAll('li');
        starshipsItems.forEach(function(item) {
            var starshipName = item.dataset.starships.toLowerCase();
            var cargoCapacity = parseInt(item.dataset.cargoCapacity, 10) || 0; // Assuming data-cargoCapacity is set for each item

            var matchesSearch = starshipName.includes(searchValue);
            var matchesCargoCapacity = cargoCapacity >= (minCapacityValue || 0) && cargoCapacity <= (maxCapacityValue || Infinity);

            if (matchesSearch && matchesCargoCapacity) {
                item.style.display = ''; // Show the item if it matches both search and cargo capacity criteria
            } else {
                item.style.display = 'none'; // Otherwise, hide it
                // Remove the info box if present
                var nextElement = item.nextElementSibling;
                if (nextElement && nextElement.classList.contains('info-box')) {
                    nextElement.remove();
                }
            }
        });
    }

    // Keeping the original functions as they are
    function toggleStarshipInformation(starshipName, targetElement) {
        var existingInfoBox = targetElement.nextElementSibling;
        if (existingInfoBox && existingInfoBox.classList.contains('info-box')) {
            existingInfoBox.remove();
        } else {
            fetchStarshipInformation(starshipName, targetElement);
        }
    }

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

    function displayStarshipInformation(starshipsInfo, targetElement) {
        var infoBox = document.createElement('div');
        infoBox.classList.add('info-box');
        infoBox.dataset.starships = starshipsInfo.name;
        infoBox.textContent = `Info: ${JSON.stringify(starshipsInfo)}`;
        targetElement.insertAdjacentElement('afterend', infoBox);
    }
});
