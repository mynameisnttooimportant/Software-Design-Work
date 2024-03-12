//VARIABLES CREATED
//var category

var searchInput = document.getElementById('search');
var elementsList = document.getElementById('search-list'); // Gets list element

// Wait until DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    buildCategoryElementList(category, elementsList); // Generates list of category elements

    addEventListenersToElementList(category, elementsList); // adds event listeners for clicking on elements
    
    loadCriteria(); // loads filter criteria into dropdowns
    
    searchInput.addEventListener('input', function() {
        search(searchInput,category,elementsList);
    });
});

function buildCategoryElementList(fetchingFromCategory, elementsList) {
    // Capture sorting criteria from UI
    const sortCriteria = document.getElementById('sort_criteria').value;
    const sortDirection = document.querySelector('input[name="sort_direction"]:checked').value;

    fetch('/fetch-category-element-names', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fetch_from_category: fetchingFromCategory,
            sort_by: sortCriteria,  // Added
            sort_direction: sortDirection,  // Added
        })
    })
    .then(response => response.json())
    .then(data => {
        // Call function to display information
        buildCategoryElementListHTML(data,elementsList);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function buildCategoryElementListHTML(elements, elementsList){
    elementsList.innerHTML = ''; // Clear existing elements

    for(let i = 0; i < elements.length; i++){
        let element = elements[i][0]; // Adjusted to accommodate array structure from SQL query

        let entry = document.createElement('li');
        entry.dataset.elementName = element;
        entry.appendChild(document.createTextNode(element));
        
        elementsList.appendChild(entry);
    }
}

function addEventListenersToElementList(category, elementsList){
    elementsList.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            let elementName = event.target.dataset.elementName;
            toggleElementInformation(category, elementName, event.target);
        }
    });
}

function toggleElementInformation(fromCategory, elementName, targetElement) {
    var existingInfoBox = targetElement.nextElementSibling;
    if (existingInfoBox && existingInfoBox.classList.contains('info-box')) {
        existingInfoBox.remove();
    } else {
        buildElementInfoBox(fromCategory, elementName, targetElement);
    }
}

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

function displayElementInformation(fromCategory, elementInfo, targetListElement) {
    var infoBox = document.createElement('div');
    infoBox.classList.add('info-box');
    infoBox.innerHTML = formatElementInformationForDisplay(fromCategory, elementInfo);
    targetListElement.insertAdjacentElement('afterend', infoBox);
}

function formatElementInformationForDisplay(fromCategory, info){
     let formattedInfo = "ERR: !!NO FORMAT FOUND!!"
    switch(fromCategory) {
      // Format case examples remain unchanged
    }
    return formattedInfo;
}

function loadCriteria(){
    var select = document.getElementById('criteria_filter_selector');
    let criteria = stringToList(criteriaOptions);

    for (let i = 0; i < criteria.length; i++) {
        addToSelector(criteria[i],select)
    }
}

function stringToList(str){
    return str.slice(1,-1).replaceAll(" ","").replaceAll("&#39;","").split(",");
}

function addToSelector(add,selector){
     var opt = document.createElement('option');
     opt.value = add;
     opt.innerHTML = cleanTextForDisplay(add);
     selector.appendChild(opt);
}

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
    return cleanedText.trim();
}

function filterCriteriaSelected(){
    let selectedCriteria = document.getElementById("criteria_filter_selector").value;
    let selectedCriteria_type = stringToList(criteriaOptions_dataTypes)[
        stringToList(criteriaOptions).indexOf(selectedCriteria)
    ];

    document.getElementById("criteria_filter_options_text").style.display = "none";
    document.getElementById("criteria_filter_options_real").style.display = "none";

    if (selectedCriteria_type == "text" || selectedCriteria_type == "charactervarying"){
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
