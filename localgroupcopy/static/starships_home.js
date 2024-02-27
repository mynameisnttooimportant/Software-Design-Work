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
        applyFilters();
    });

    filterBtn.addEventListener('click', function() {
        applyFilters();
    });

    function applyFilters() {
        var searchValue = searchInput.value.toLowerCase();
        var starshipsItems = starshipsList.querySelectorAll('li');
        
        starshipsItems.forEach(function(item) {
            var starshipName = item.dataset.starships.toLowerCase();
            var cargoCapacity = parseInt(item.dataset.cargoCapacity, 10);

            var matchesSearch = starshipName.includes(searchValue);
            var matchesMinCargo = !minCargoCapacity.value || cargoCapacity >= parseInt(minCargoCapacity.value, 10);
            var matchesMaxCargo = !maxCargoCapacity.value || cargoCapacity <= parseInt(maxCargoCapacity.value, 10);
            
            if (matchesSearch && matchesMinCargo && matchesMaxCargo) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
                var infoBox = item.nextElementSibling;
                if (infoBox && infoBox.classList.contains('info-box')) {
                    infoBox.remove();
                }
            }
        });
    }

    function fetchStarshipInformation(starshipName, targetElement) {
        fetch('/starships-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                starships: starshipName,
            }),
        })
        .then(response => response.json())
        .then(data => {
            displayStarshipInformation(data, targetElement);
        })
        .catch(error => {
            console.error('Error:', error);
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

    function displayStarshipInformation(starshipsInfo, targetElement) {
        var infoBox = document.createElement('div');
        infoBox.classList.add('info-box');
        infoBox.dataset.starships = starshipsInfo.name;
        infoBox.textContent = `Info: ${JSON.stringify(starshipsInfo)}`; // Assuming starshipsInfo is an object
        targetElement.insertAdjacentElement('afterend', infoBox);
    }
});
