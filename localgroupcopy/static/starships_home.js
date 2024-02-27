document.addEventListener('DOMContentLoaded', function() {
    var starshipsList = document.getElementById('starships-list');

    starshipsList.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            var starshipName = event.target.dataset.starships;
            toggleStarshipInformation(starshipName, event.target);
        }
    });

    var searchInput = document.getElementById('search');
    searchInput.addEventListener('input', function() {
        var searchValue = searchInput.value.toLowerCase();
        var starshipsItems = starshipsList.querySelectorAll('li');

        starshipsItems.forEach(function(item) {
            var starshipName = item.dataset.starships.toLowerCase();
            if (starshipName.includes(searchValue)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
                var infoBox = item.nextElementSibling;
                if (infoBox && infoBox.classList.contains('info-box')) {
                    infoBox.remove();
                }
            }
        });
    });

    var filterBtn = document.getElementById('filter-btn');
    filterBtn.addEventListener('click', function() {
        var minCargoCapacity = document.getElementById('min-cargo-capacity').value;
        var maxCargoCapacity = document.getElementById('max-cargo-capacity').value;
        fetchStarshipInformationWithCargoCapacity(searchInput.value, minCargoCapacity, maxCargoCapacity);
    });

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
        infoBox.textContent = `Info: ${JSON.stringify(starshipsInfo)}`; // Adjust according to how you want to display the info
        targetElement.insertAdjacentElement('afterend', infoBox);
    }

    function fetchStarshipInformationWithCargoCapacity(starshipName, minCargo, maxCargo) {
        fetch('/starships-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                starships: starshipName,
                minCargoCapacity: minCargo || 0,
                maxCargoCapacity: maxCargo || Number.MAX_SAFE_INTEGER
            })
        })
        .then(response => response.json())
        .then(data => {
            while (starshipsList.firstChild) {
                starshipsList.removeChild(starshipsList.firstChild);
            }
            data.forEach(starship => {
                var listItem = document.createElement('li');
                listItem.textContent = starship.name; // Ensure 'name' matches your data structure
                listItem.dataset.starships = starship.name;
                listItem.addEventListener('click', function() {
                    toggleStarshipInformation(starship.name, listItem);
                });
                starshipsList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
