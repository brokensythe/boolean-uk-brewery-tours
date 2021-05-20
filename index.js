// Deliverables
// - A user can enter a US state and view a list of breweries in that state
//     - The list has a maximum of 10 breweries in it
//     - The list has three types of breweries that offer brewery tours:
//         - Micro
//         - Regional
//         - Brewpub
//     - Do not show the other types of breweries
// - From the list of breweries, a user can view the following details about each brewery:
//     - Name
//     - Type of brewery
//     - Address
//     - Phone Number
// - From the list of breweries, a user can visit the website of a brewery
// - From the 'filter by type of brewery' section, a user can filter by type of brewery
// - From the 'filter by city' section, a user can filter by city, the location of the brewery
// - From the 'filter by city' section, a user can clear all filters
// - From the 'search' section, a user can search for breweries by:
//     - Name
//     - City


const state = {
  breweries: [],
};


// to make sure the brewery offers a tour: activeBreweries = state.breweries.filter( brewery => brewery.brewery_type=== "regional" || brewery.brewery_type=== "micro"|| brewery.brewery_type=== "brewpub" )
// to get the info from the form: formEl.select-state.value
// to match the state to the user query: state.breweries.filter( brewery => brewery.state === formEl.select-state.value )
// if I want to limit the amount of returns from the array we loop like: (let i = 0, i < 10, i++)


const pageDisplayEl = document.querySelector(".list-results")
const whatStateForm = document.querySelector("#select-state-form")
whatStateForm.addEventListener("submit", function (event) {
  event.preventDefault()
  const userInput = whatStateForm["select-state"].value
  fetchBreweriesFromState(userInput)
})

const searchFilterEl = document.createElement("aside")
const searchResultHeading = document.createElement("h1")
searchResultHeading.classList.add("results-heading")
searchResultHeading.innerText = "List of Breweries"
const searchBarHeader = document.createElement("header")
searchBarHeader.classList.add("search-bar")
const listContainerEl = document.createElement("article")
const breweryListEL = document.createElement("ul")
breweryListEL.classList.add("breweries-list")



// input: none
// action: creates the form inside the header
// output: the form
function createsForm () {
  searchBarHeader.innerHTML = ""
  const searchBarFormEl = document.createElement("form")
  searchBarFormEl.setAttribute("id", "search-breweries-form")
  searchBarFormEl.setAttribute("autocomplete", "off")
  
  const formLabel = document.createElement("label")
  formLabel.setAttribute("for", "search-breweries")
  
  const labelText = document.createElement("h2")
  labelText.innerText = "Search breweries:"
  
  formLabel.append(labelText)
  
  const formInput = document.createElement("input")
  formInput.setAttribute("id", "search-breweries")
  formInput.setAttribute("name", "search-breweries")
  formInput.setAttribute("type", "text")
  
  searchBarFormEl.append(formLabel, formInput)
  
  return searchBarFormEl
}

// input: an item from the array state.breweries
// action: creates a brewery description
// return: an element that describes a brewery
function createBreweryItem (brewery) {
  const breweryEl = document.createElement("li")
  
  const breweryName = document.createElement("h2")
  breweryName.innerText = brewery.name
  
  const breweryType = document.createElement("div")
  breweryType.classList.add("type")
  breweryType.innerText = brewery.brewery_type
  
  const totalAddressInfo = document.createElement("section")
  totalAddressInfo.classList.add("address")
  
  const addressHeading = document.createElement("h3")
  addressHeading.innerText = "Address:"
  
  const streetInfo = document.createElement("p")
  streetInfo.innerText = brewery.street
  
  const cityAndPostcode = document.createElement("p")
  const cityAndPostcodeInfo = document.createElement("strong")
  cityAndPostcodeInfo.innerText = `${brewery.city}, ${brewery.postal_code}`
  cityAndPostcode.append(cityAndPostcodeInfo)
  
  totalAddressInfo.append(addressHeading, streetInfo, cityAndPostcode)
  
  
  const phoneNoSection = document.createElement("section")
  phoneNoSection.classList.add("phone")
  
  const phoneHeading = document.createElement("h3")
  phoneHeading.innerText = "Phone:"
  
  const phoneInfo = document.createElement("p")
  phoneInfo.innerText = brewery.phone
  
  phoneNoSection.append(phoneHeading, phoneInfo)
  
  const websiteSection = document.createElement("section")
  websiteSection.classList.add("link")
  
  const websiteAnchorEl = document.createElement("a")
  websiteAnchorEl.setAttribute("href", brewery.website_url)
  websiteAnchorEl.setAttribute("target","_blank")
  websiteAnchorEl.innerText = "Visit Website"
  
  websiteSection.append(websiteAnchorEl)
  
  breweryEl.append(breweryName, breweryType, totalAddressInfo, phoneNoSection, websiteSection)
  
  
  return breweryEl
}

// input: none
// action: creates the child elements of the main block of the body
// output: undefined
function createsMainElements () {
  pageDisplayEl.append(searchFilterEl, searchResultHeading, searchBarHeader, listContainerEl)
  listContainerEl.append(breweryListEL)
  breweryListEL.innerHTML =""
  for (const brewery of state.breweries) {
    const breweryEl = createBreweryItem (brewery)
    breweryListEL.append(breweryEl)
  }
  const searchBarFormEl = createsForm()
  searchBarHeader.append(searchBarFormEl)
}

// fetching state from the server
function fetchBreweriesFromState (USState) {
  fetch(`https://api.openbrewerydb.org/breweries?by_state=${USState}&per_page=50`)
    .then(function (response) {
      return response.json()
    })
    .then(function (breweries) {
      const filteredBreweryList = breweries.filter( newBreweries => newBreweries.brewery_type=== "regional" || newBreweries.brewery_type=== "micro"|| newBreweries.brewery_type=== "brewpub")
      const condensedBreweryList = filteredBreweryList.slice(0, 10)
      state.breweries = condensedBreweryList
      createsMainElements()
    });
}
