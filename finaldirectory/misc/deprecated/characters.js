// Wait until DOM content has been fully loaded prior to the execution of js code
document.addEventListener('DOMContentLoaded', function() {
    // Grab characters list element from HTML doc
    var charactersList = document.getElementById('characters-list');
    
    // Add the 'click' event listener to handle any 'click' action from user
    charactersList.addEventListener('click', function(event) {
        // Check if the clicked element is a list type
        if (event.target.tagName === 'LI') {
            var charactersName = event.target.dataset.characters;
	    // Call function that displays character information on click
            toggleCharactersInformation(charactersName, event.target);
        }
    });
    
    // Get the search input item from the HTML doc 
    var searchInput = document.getElementById('search');

    // Add event listener for the search action 
    searchInput.addEventListener('input', function() {
        var searchValue = searchInput.value.toLowerCase();
        // Get all items that are of type list from the page
        var charactersItems = charactersList.querySelectorAll('li');

        charactersItems.forEach(function(item) {
            var charactersName = item.dataset.characters.toLowerCase();
            // Check if the character name includes the search value
            if (charactersName.includes(searchValue)) {
                // If the character name matches the search value, show the list item
                item.style.display = 'block';
            } else {
                // If the character name does not match the search value, hide the list item
                item.style.display = 'none';
                // Check if there is an info box associated with the list item
                var infoBox = item.nextElementSibling;
                if (infoBox && infoBox.classList.contains('info-box')) {
                    // If an info box exists, remove it
                    infoBox.remove();
                }
            }
        });
    });

    // Function to fetch character data from our database
    function fetchCharactersInformation(charactersName, targetElement) {
        fetch('/characters-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                characters: charactersName
            })
        })
        .then(response => response.json())
        .then(data => {
            // Call function to display characters information
            displayCharactersInformation(data, targetElement);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Function to check if info box exists for characters upon click
    function toggleCharactersInformation(charactersName, targetElement) {
	// Grab the next item of the element that has been clicked
        var existingInfoBox = targetElement.nextElementSibling;
	// Check if that item already displays its info box
        if (existingInfoBox && existingInfoBox.classList.contains('info-box')) {
            // If an info box exists, remove it
            existingInfoBox.remove();
        } else {
            // If an info box does not exist, display the info box
            fetchCharactersInformation(charactersName, targetElement);
        }
    }


    // Function to display character information upon toggle
    function displayCharactersInformation(charactersInfo, targetElement) {
        // Create a formatted string with the characters information
        var formattedInfo = `
            <p><strong>Name:</strong> ${charactersInfo[0]}</p>
            <p><strong>Height:</strong> ${charactersInfo[1]}</p>
            <p><strong>Mass:</strong> ${charactersInfo[2]}</p>
            <p><strong>Skin Color:</strong> ${charactersInfo[3]}</p>
            <p><strong>Hair Color:</strong> ${charactersInfo[4]}</p>
            <p><strong>Eye Color:</strong> ${charactersInfo[5]}</p>
            <p><strong>Birth Year:</strong> ${charactersInfo[6]}</p>
            <p><strong>Gender:</strong> ${charactersInfo[7]}</p>
            <p><strong>Home World:</strong> ${charactersInfo[8]}</p>
            <p><strong>Species:</strong> ${charactersInfo[9]}</p>
        `;

        // Create a div element for the info box
        var infoBox = document.createElement('div');
        infoBox.classList.add('info-box');
        infoBox.dataset.characters = charactersInfo.name;
        // Set the HTML content of the info box to the formatted character information
        infoBox.innerHTML = formattedInfo;

        //Insert the info box after the target element
        targetElement.insertAdjacentElement('afterend', infoBox);
    }
});
