
//VARIABLES CREATED
//var category

var searchInput = document.getElementById('search');
var elementsList = document.getElementById('search-list'); // Gets list element
var sortCriteriaSelector = document.getElementById('sort-criteria');

// Wait until DOM content loaded
document.addEventListener('DOMContentLoaded', function() {

    buildCategoryElementList(category, elementsList); // Generates list of category elements
    addEventListenersToElementList(category, elementsList); // Adds event listeners for clicking on elements
    loadCriteria(); // Loads filter criteria into dropdowns
    searchInput.addEventListener('input', function() {
        search(searchInput, category, elementsList);
    });

    // Sort criteria selector event listener
    sortCriteriaSelector.addEventListener('change', function() {
        var selectedSortCriteria = sortCriteriaSelector.value;
        buildCategoryElementList(category, elementsList, selectedSortCriteria);
    });
});







//fetches names of all elements in a category (e.g. all species, all characters, etc.)
//then adds these names to the display as list elements
// Adds a sort parameter to the function.
function buildCategoryElementList(fetchingFromCategory, elementsList, sortCriteria = 'name', sortDirection = 'ASC') {
    fetch('/fetch-category-element-names', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fetch_from_category: fetchingFromCategory,
            sort_by: sortCriteria,
            sort_direction: sortDirection // Include sorting parameters
        })
    })
    .then(response => response.json())
    .then(data => {
        // Clears the current list and rebuilds it with sorted data
        elementsList.innerHTML = ''; // Clear current list elements before adding new ones
        buildCategoryElementListHTML(data, elementsList);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

//adds list elements to the page based on what's returned by the sql query
function buildCategoryElementListHTML(elements,elementsList){
    

    for(let i = 0; i < elements.length; i++){
        let element = elements[i];

        let entry = document.createElement('li');
        entry.dataset.elementName = element;
        entry.appendChild(document.createTextNode(element));
        
        elementsList.appendChild(entry);
    }
}








//adds click event listeners to element list
function addEventListenersToElementList(category, elementsList){

    elementsList.addEventListener('click', function(event) {

        // Check if the clicked element is a list type
        if (event.target.tagName === 'LI') {

            let elementName = event.target.dataset.elementName;
            console.log(elementName)
            toggleElementInformation(category, elementName, event.target);

        }

    });

}

// check if info box exists for characters upon click, 
//delete if so, build one if not
function toggleElementInformation(fromCategory, elementName, targetElement) {

    // Grab the next item of the element that has been clicked
    var existingInfoBox = targetElement.nextElementSibling;

    // Check if that item already displays its info box
    if (existingInfoBox && existingInfoBox.classList.contains('info-box')) {
        
        existingInfoBox.remove(); // If an info box exists, remove it

    } else {
 
        buildElementInfoBox(fromCategory, elementName, targetElement);

    }
}

// builds info box
function buildElementInfoBox(fromCategory, elementName, targetListElement) {
    fetch('/element-info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fetch_from_category: fromCategory,
            fetch_element: elementName
        })
    })
    .then(response => response.json())
    .then(data => {

        displayElementInformation(fromCategory, data, targetListElement);

    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to display character information upon toggle
function displayElementInformation(fromCategory, elementInfo, targetListElement) {

    // Create a div element for the info box
    var infoBox = document.createElement('div');
    infoBox.classList.add('info-box');
    
    infoBox.innerHTML = formatElementInformationForDisplay(fromCategory, elementInfo); // Set the HTML content of the info box to the formatted character information

    //Insert the info box after the target element
    targetListElement.insertAdjacentElement('afterend', infoBox);
}

function formatElementInformationForDisplay(fromCategory, info){
     let formattedInfo = "ERR: !!NO FORMAT FOUND!!"

    switch(fromCategory) {
      case "starships":
        formattedInfo = `
            <p><strong>Model:</strong> ${info[1]}</p>
            <p><strong>Manufacturer:</strong> ${info[2]}</p>
            <p><strong>Cost (credits):</strong> ${info[3]}</p>
            <p><strong>Length (meters):</strong> ${info[4]}</p>
            <p><strong>Maximum Atmosphering Speed (km/h):</strong> ${info[5]}</p>
            <p><strong>Crew:</strong> ${info[6]}</p>
            <p><strong>Passengers:</strong> ${info[7]}</p>
            <p><strong>Cargo Capacity (kilograms):</strong> ${info[8]}</p>
            <p><strong>Consumables:</strong> ${info[9]}</p>
            <p><strong>Hyperdriving Rating:</strong> ${info[10]}</p>
            <p><strong>mglt:</strong> ${info[11]}</p>
            <p><strong>Starship Class:</strong> ${info[12]}</p>
        `;
        break;

      case "species":
        formattedInfo = `
            <p><strong>Classification:</strong> ${info[1]}</p>
            <p><strong>Designation:</strong> ${info[2]}</p>
            <p><strong>Average Height (centimeters):</strong> ${info[3]}</p>
            <p><strong>Skin Color:</strong> ${info[4]}</p>
            <p><strong>Hair Color:</strong> ${info[5]}</p>
            <p><strong>Eye Color:</strong> ${info[6]}</p>
            <p><strong>Lifespan (standard years):</strong> ${info[7]}</p>
            <p><strong>Language:</strong> ${info[8]}</p>
            <p><strong>Home World:</strong> ${info[9]}</p>
        `;
        break;

      case "planets":
        formattedInfo = `
            <p><strong>Name:</strong> ${info[0]}</p>
            <p><strong>Rotation Period (Days):</strong> ${info[1]}</p>
            <p><strong>Orbital Period (Days):</strong> ${info[2]}</p>
            <p><strong>Diameter:</strong> ${info[3]}</p>
            <p><strong>Climate:</strong> ${info[4]}</p>
            <p><strong>Gravity:</strong> ${info[5]}</p>
            <p><strong>Terrain:</strong> ${info[6]}</p>
            <p><strong>Water Coverage (%):</strong> ${info[7]}</p>
            <p><strong>Population:</strong> ${info[8]}</p>
        `;
        break;

      case "vehicles":
        formattedInfo = `
            <p><strong>Name:</strong> ${info[0]}</p>
            <p><strong>Model:</strong> ${info[1]}</p>
            <p><strong>Manufacturer:</strong> ${info[2]}</p>
            <p><strong>Cost (Credits):</strong> ${info[3]}</p>
            <p><strong>Length (Meters):</strong> ${info[4]}</p>
            <p><strong>Max Atmosphering Speed (km/h):</strong> ${info[5]}</p>
            <p><strong>Crew:</strong> ${info[6]}</p>
            <p><strong>Passengers:</strong> ${info[7]}</p>
            <p><strong>Cargo Capacity (kg):</strong> ${info[8]}</p>
            <p><strong>Consumables:</strong> ${info[9]}</p>
            <p><strong>Class:</strong> ${info[10]}</p>
        `;
        break;

      case "characters":
        formattedInfo = `
            <p><strong>Name:</strong> ${info[0]}</p>
            <p><strong>Height (cm):</strong> ${info[1]}</p>
            <p><strong>Mass (kg):</strong> ${info[2]}</p>
            <p><strong>Skin Color:</strong> ${info[3]}</p>
            <p><strong>Hair Color:</strong> ${info[4]}</p>
            <p><strong>Eye Color:</strong> ${info[5]}</p>
            <p><strong>Birth Year:</strong> ${info[6]}</p>
            <p><strong>Gender:</strong> ${info[7]}</p>
            <p><strong>Home World:</strong> ${info[8]}</p>
            <p><strong>Species:</strong> ${info[9]}</p>
        `;
        break;

      default:
        console.log("ERROR: NO ELEMENT FORMAT FOUND FOR THIS CATEGORY!")
    }

    return formattedInfo;
}





//loads the possible criteria from the column names of the database
function loadCriteria(){
	var select = document.getElementById('criteria_filter_selector');
    let criteria = stringToList(criteriaOptions);

    for (let i = 0; i < criteria.length; i++) {
        addToSelector(criteria[i],select)
    }
}

//converts lists from strings to lists in js
function stringToList(str){
    return str.slice(1,-1).replaceAll(" ","").replaceAll("&#39;","").split(",");
}

//adds supplied value to a <select> element
function addToSelector(add,selector){
     var opt = document.createElement('option');
     opt.value = add;
     opt.innerHTML = cleanTextForDisplay(add);
     selector.appendChild(opt);
}

//replaces underscores with spaces, capitalizes each word
function cleanTextForDisplay(w){
    let words = w.replaceAll("_", " ").split(" ");

    let cleanedText = "";

    for(let i = 0; i < words.length; i++){

        let word = words[i].replaceAll(" ","");
        let capitalized =
            word.charAt(0).toUpperCase()
            + word.slice(1);

        cleanedText += capitalized + " ";
    }

    return cleanedText;
}

//displays the selection boxes / text entry boxes for the type of data entry required (e.g. "name" will need text entry, "size" will need number entry)
var filterCriteriaTypeCurrent = "none";
function filterCriteriaSelected(){
    let selectedCriteria = document.getElementById("criteria_filter_selector").value;
    let selectedCriteria_type = stringToList(criteriaOptions_dataTypes)[
        stringToList(criteriaOptions).indexOf(selectedCriteria)
    ];

    document.getElementById("criteria_filter_options_text").style.display = "none";
    document.getElementById("criteria_filter_options_real").style.display = "none";


    if        (selectedCriteria_type == "text" || selectedCriteria_type == "charactervarying"){

        document.getElementById("criteria_filter_options_text").style.display = "block";
        filterCriteriaTypeCurrent = "text";

    } else if (selectedCriteria_type == "real" || selectedCriteria_type == "integer"){
        
        document.getElementById("criteria_filter_options_real").style.display = "block";
        filterCriteriaTypeCurrent = "real";
    
    }
    
}

//dictionary that converts from filter types to displayable text
var filterCriteria = [];
const criteriaTypesToDisplay = {
    "filter_real_is": "Is",
    "filter_real_closeTo": "Close To",
    "filter_real_greaterThan": "Greater Than",
    "filter_real_lessThan": "Less Than",
    "filter_text_is": "Is",
    "filter_text_contains": "contains",
    "filter_text_startsWith": "Starts With",
    "filter_text_endsWith": "Ends With",
}

//adds a new filter to the filterCriteria and displays it on the page
function filterCriteriaAdded(){


    let newFilter = {
        "type": filterCriteriaTypeCurrent, //type is either text or real (as in a real number)
        "criteria": document.getElementById("criteria_filter_selector").value, //the criteria you're filtering by (e.g. Cargo Space / Cost / etc.)
        "criteria_filter": "dummy value",
        "value": "dummy value"
    }

    //sets filter values based on user entry and data type
    switch(filterCriteriaTypeCurrent){
        case "none":
            return;

        case "text":
            newFilter["criteria_filter"] = document.getElementById("criteria_filter_options_dropdown_text").value;
            newFilter["value"] = document.getElementById("criteria_filter_options_entry_text").value;

            break;

        case "real": //real --> real number
            newFilter["criteria_filter"] = document.getElementById("criteria_filter_options_dropdown_real").value;
            newFilter["value"] = document.getElementById("criteria_filter_options_entry_real").value.toString();

            break;

    }


    //stops if the value is empty
    if(newFilter["value"] == ""){
        return;
    }


    //appends the new filter to the filter criteria
    filterCriteria.push(newFilter);


    const filtersListDisplay = document.getElementById("criteria_filters");

    //adds the new filter to be displayed on the page
    filtersListDisplay.appendChild(document.createElement("br"));
    filtersListDisplay.appendChild(document.createTextNode(  
        cleanTextForDisplay(newFilter["criteria"]) + " " 
        + criteriaTypesToDisplay[newFilter["criteria_filter"]] + " " 
        + newFilter["value"] 
    ));

    search(searchInput,category,elementsList);
}




 
function search(searchInput,category,elementsList) {
    let searchValue = searchInput.value.toLowerCase();

    let items = elementsList.querySelectorAll('li');  // Get all items that are of type list from the page

    items.forEach(function(item) {
        const name = item.dataset.elementName;
        const name_lower = name.toLowerCase();

        if(name_lower.includes(searchValue)){ // Check if the character name includes the search value
            setListItemDisplayBasedOnFilters(item,filterCriteria,name,category,elementsList);
        } else {
            setListItemDisplay(item,false);
        }
    });
}

//displays or hides an item in an element list based on provided criteria
function setListItemDisplayBasedOnFilters(item,criteria,name,fetchingFromCategory, elementsList) {
    if(criteria.length <= 0){
        setListItemDisplay(item,false);
    }

    console.log(criteria);
    console.log(name);
    console.log(fetchingFromCategory);

    fetch('/check-if-filter-applies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fetch_from_category : fetchingFromCategory,
            fetch_element : name,
            fetch_by_criteria : criteria
        })
    }).then(response => response.json())
    .then(data => {

        if(data.result === "true"){
            setListItemDisplay(item,true);
        } else {
            setListItemDisplay(item,false);
        };

    })
    .catch(error => {
        console.error('Error:', error);
    });

    
}

//displays or hides an item in an element list
function setListItemDisplay(item,doDisplay) {
    if (doDisplay) { 

        item.style.display = 'block';

    } else {
        item.style.display = 'none';

        // Check if there is an info box associated with the list item
        let infoBox = item.nextElementSibling;
        if (infoBox && infoBox.classList.contains('info-box')) {
            // If an info box exists, remove it
            infoBox.remove();
        }

    }
}
