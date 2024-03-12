//runs when the page is loaded
window.onload = function setup(){
    setSelectedCategory();
    loadCriteria();
}

//sets the dropdown for categories (starships, characters, etc...) to default to the currently selected category (as per the address e.g. /filter/starships)
function setSelectedCategory(){
    const categorySelectOption = document.getElementById("filter_category_selector_"+category);
    if(categorySelectOption != null){
        categorySelectOption.selected = true;
    }
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
}


 //loads the search page using current user query
function search(){
    let searchQuery = "";
    for(let i = 0; i < filterCriteria.length; i++){
        let criteria = filterCriteria[i];
        if(i != 0){
            searchQuery += "&"
        }
        searchQuery += criteria["criteria"]+"&"+criteria["criteria_filter"]+"&"+criteria["value"];
    }

    window.location.href = "./"+category+"/search/"+searchQuery;
}

//hopefully prevents sql injection & stuff breaking in general, probably still completely possible to do both of those things though
function sanitizeUserInputForSearch(inp){
    return inp.toLowerCase().replaceAll(";","").replaceAll("+","").replaceAll("&","").replaceAll(" ","+");
}