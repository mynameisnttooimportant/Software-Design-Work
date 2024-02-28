document.addEventListener('DOMContentLoaded', function() {
    const starshipsList = document.getElementById('starships-list');
    const searchInput = document.getElementById('search');
    const filterBtn = document.getElementById('filter-btn');
    const minCargoCapacity = document.getElementById('min-cargo-capacity');
    const maxCargoCapacity = document.getElementById('max-cargo-capacity');

    starshipsList.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            const starshipName = event.target.dataset.starships;
            toggleStarshipInformation(starshipName, event.target);
        }
    });

    searchInput.addEventListener('input', fetchFilteredStarships);
    filterBtn.addEventListener('click', fetchFilteredStarships);

    function fetchFilteredStarships() {
        const searchValue = searchInput.value.toLowerCase();
        const minCapacityValue = minCargoCapacity.value || "0";
        const maxCapacityValue = maxCargoCapacity.value || "Infinity";

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
        .then(data => updateStarshipsList(data))
        .catch(error => console.error('Error:', error));
    }

    function updateStarshipsList(data) {
        starshipsList.innerHTML = '';
        data.forEach(starship => {
            const li = document.createElement('li');
            li.textContent = starship.name;
            li.dataset.starships = starship.name;
            starshipsList.appendChild(li);
        });
    }

    function toggleStarshipInformation(starshipName, targetElement) {
        const existingInfoBox = targetElement.nextElementSibling;
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
            body: JSON.stringify({ starships: starshipName })
        })
        .then(response => response.json())
        .then(data => displayStarshipInformation(data, targetElement))
        .catch(error => console.error('Error fetching starship information:', error));
    }

    function displayStarshipInformation(starshipsInfo, targetElement) {
        const infoBox = document.createElement('div');
        infoBox.classList.add('info-box');
        infoBox.dataset.starships = starshipsInfo.name;
        infoBox.textContent = `Info: ${JSON.stringify(starshipsInfo)}`;
        targetElement.insertAdjacentElement('afterend', infoBox);
    }
});
