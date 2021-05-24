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
  breweryTypeFilter: "",
  breweryCityFilter: [],
  searchInfoFilter: ""
};


// to make sure the brewery offers a tour: activeBreweries = state.breweries.filter( brewery => brewery.brewery_type=== "regional" || brewery.brewery_type=== "micro"|| brewery.brewery_type=== "brewpub" )
// to get the info from the form: formEl.select-state.value
// to match the state to the user query: state.breweries.filter( brewery => brewery.state === formEl.select-state.value )
// if I want to limit the amount of returns from the array we loop like: (let i = 0, i < 10, i++)
// to remove duplicates from an array this is a nice pattern: 
// for (const arrayWithDuplicatesElement of arrayWithDuplicates) {
//   if (!newArray.includes(arrayWithDuplicatesElement)) {
//     newArray.push(arrayWithDuplicatesElement)
//   }
// }


const pageDisplayEl = document.querySelector(".list-results")
const whatStateForm = document.querySelector("#select-state-form")
whatStateForm.addEventListener("submit", function (event) {
  event.preventDefault()
  const userInput = whatStateForm["select-state"].value
  fetchBreweriesFromState(userInput)
})

const searchResultHeading = document.createElement("h1")
searchResultHeading.classList.add("results-heading")
searchResultHeading.innerText = "List of Breweries"
const searchBarHeader = document.createElement("header")
searchBarHeader.classList.add("search-bar")
const listContainerEl = document.createElement("article")




// input: none
// action: creates the form inside the header
// output: the form
function createsForm () {
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

  searchBarFormEl.addEventListener("submit", function (event) {
    event.preventDefault()

    if (state.breweryTypeFilter.length < 1 && state.breweryCityFilter.length < 1) {
      let filteredBreweries = state.breweries.filter( brewery => brewery.name.includes(searchBarFormEl["search-breweries"].value) )
  
      createsMainElements(filteredBreweries)
    } else if (state.breweryTypeFilter.length >= 1 && state.breweryCityFilter.length < 1) {
      let filteredBreweries = state.breweries.filter( brewery => brewery.brewery_type === state.breweryTypeFilter)
      filteredBreweries = filteredBreweries.filter( brewery => brewery.name.includes(searchBarFormEl["search-breweries"].value) )

      createsMainElements(filteredBreweries)
    }else if (state.breweryTypeFilter.length < 1 && state.breweryCityFilter.length >= 1) {
      let filteredBreweries = state.breweries.filter( brewery => state.breweryCityFilter.includes(brewery.city) )
      filteredBreweries = filteredBreweries.filter( brewery => brewery.name.includes(searchBarFormEl["search-breweries"].value) )

      createsMainElements(filteredBreweries)
    }else if (state.breweryTypeFilter.length >= 1 && state.breweryCityFilter.length >= 1) {
      let filteredBreweries = state.breweries.filter( brewery => brewery.brewery_type === state.breweryTypeFilter)
      filteredBreweries = filteredBreweries.filter( brewery => state.breweryCityFilter.includes(brewery.city) )
      filteredBreweries = filteredBreweries.filter( brewery => brewery.name.includes(searchBarFormEl["search-breweries"].value) )

      createsMainElements(filteredBreweries)
    }
  })
  
  console.log(Boolean(searchBarFormEl["search-breweries"].value))
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


// input: the correct list of breweries
// action: creates the child elements of the main block of the body
// output: undefined
function createsMainElements (filteredBreweries) {
  const searchBarHeader = document.createElement("header")
  searchBarHeader.classList.add("search-bar")
  
  
  const breweryListEL = document.createElement("ul")
  breweryListEL.classList.add("breweries-list")
  
  listContainerEl.innerHTML = ""
  pageDisplayEl.append(searchResultHeading, searchBarHeader, listContainerEl)
  
  listContainerEl.append(breweryListEL)
  
  for (const brewery of filteredBreweries.slice(0, 10)) {
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
      state.breweries = filteredBreweryList
      createsMainElements(state.breweries)
      createsFilterSection()
    });
}

// input: none 
// action: will create filter elements
// output: city filter form
function createsFilterSection () {
  const searchFilterEl = document.createElement("aside")
  searchFilterEl.classList.add("filters-section")

    const filterByTypeHeading = document.createElement("h2")
    filterByTypeHeading.innerText = "Filter By:"

    const filterByTypeForm = document.createElement("form")
    filterByTypeForm.setAttribute("id", "filter-by-type-form")
    filterByTypeForm.setAttribute("autocompete", "off")

      const filterByTypeLabel = document.createElement("label")
      filterByTypeLabel.setAttribute("for", "filter-by-type")

        const labelText = document.createElement("h3")
        labelText.innerText = "Type of Brewery"

      filterByTypeLabel.append(labelText)

      const filterDropdown = document.createElement("select")
      filterDropdown.setAttribute("name", "filter-by-type")
      filterDropdown.setAttribute("id", "filter-by-type")
      
      const defaultOption = document.createElement("option")
        defaultOption.setAttribute("value", "")
        defaultOption.innerText = "Select a type..."

        defaultOption.addEventListener("click", function () {
          state.breweryTypeFilter = filterDropdown.value
          
          if (state.breweryCityFilter.length >= 1) {
            const filteredBreweries = state.breweries.filter( brewery => state.breweryCityFilter.includes(brewery.city))
            createsMainElements(filteredBreweries)
          }else {
            createsMainElements(state.breweries)
          }
        })

        const microOption = document.createElement("option")
        microOption.setAttribute("value", "micro")
        microOption.innerText = "Micro"

        microOption.addEventListener("click", function () {
          state.breweryTypeFilter = filterDropdown.value

          typeMixedFilter()
        })

        const regionalOption = document.createElement("option")
        regionalOption.setAttribute("value", "regional")
        regionalOption.innerText = "Regional"
        
        regionalOption.addEventListener("click", function () {
          state.breweryTypeFilter = filterDropdown.value

          typeMixedFilter()
        })

        const brewpubOption = document.createElement("option")
        brewpubOption.setAttribute("value", "brewpub")
        brewpubOption.innerText = "Brewpub"
        
        brewpubOption.addEventListener("click", function () {
          state.breweryTypeFilter = filterDropdown.value

          typeMixedFilter()
        })

        filterDropdown.append(defaultOption, microOption, regionalOption, brewpubOption)
        
        state.breweryTypeFilter = filterDropdown.value
        
        filterByTypeForm.append(filterByTypeLabel, filterDropdown)

    const filterByCityHeading = document.createElement("div")
    filterByCityHeading.classList.add("filter-by-city-heading")

      const filterByCityHeadingText = document.createElement("h3")
      filterByCityHeadingText.innerText = "Cities"

      const resetButton = document.createElement("button")
      resetButton.classList.add("clear-all-btn")
      resetButton.innerText = "clear all"

      resetButton.addEventListener("click", function () {
        for (const checkbox of filterByCityForm.childNodes) {
          checkbox.checked = false
        }
        state.breweryCityFilter = []

        if (state.breweryTypeFilter.length >= 1) {
          let filteredBreweries = state.breweries.filter( brewery => brewery.brewery_type === state.breweryTypeFilter)
          createsMainElements(filteredBreweries)
        } else {
          createsMainElements(state.breweries)
        }
      })

      filterByCityHeading.append(filterByCityHeadingText, resetButton)

    const filterByCityForm = document.createElement("form")
    filterByCityForm.setAttribute("id", "filter-by-city-form")

    const currentBreweryCityArrayWithDuplicates = state.breweries.map( brewery => brewery.city)
    const currentBreweryCityArray = []
    
    for (const breweryCity of currentBreweryCityArrayWithDuplicates) {
      if (!currentBreweryCityArray.includes(breweryCity)) {
        currentBreweryCityArray.push(breweryCity)
      }
    }
    
    for (const breweryCity of currentBreweryCityArray.sort()) {
      const cityCheckbox = document.createElement("input")
      cityCheckbox.setAttribute("type", "checkbox")
      cityCheckbox.setAttribute("name", breweryCity)
      cityCheckbox.setAttribute("value", breweryCity)

      cityCheckbox.addEventListener("click", function () {
        if (state.breweryTypeFilter.length >= 1) {
          let filteredBreweries = state.breweries.filter( brewery => brewery.brewery_type === state.breweryTypeFilter)
          console.log(filteredBreweries)
          if (!state.breweryCityFilter.includes(cityCheckbox.value)) {
            state.breweryCityFilter.push(cityCheckbox.value)
            filteredBreweries = filteredBreweries.filter( brewery => state.breweryCityFilter.includes(brewery.city))
            console.log(filteredBreweries)
            createsMainElements(filteredBreweries)
          }else if (state.breweryCityFilter.includes(cityCheckbox.value)) {
            const itemToRemoveIndex = state.breweryCityFilter.findIndex( city => city === cityCheckbox.value)
            state.breweryCityFilter.splice(itemToRemoveIndex, 1)
            filteredBreweries = filteredBreweries.filter( brewery => state.breweryCityFilter.includes(brewery.city))
            if (state.breweryCityFilter.length >= 1) {
              console.log(filteredBreweries)
              createsMainElements(filteredBreweries)
            } else {
              filteredBreweries = state.breweries.filter( brewery => brewery.brewery_type === state.breweryTypeFilter)
              createsMainElements(filteredBreweries)
            }
          }
        } else {
          if (!state.breweryCityFilter.includes(cityCheckbox.value)) {
            state.breweryCityFilter.push(cityCheckbox.value)
            const filteredBreweries = state.breweries.filter( brewery => state.breweryCityFilter.includes(brewery.city))
            console.log(filteredBreweries)
            createsMainElements(filteredBreweries)
          }else if (state.breweryCityFilter.includes(cityCheckbox.value)) {
            const itemToRemoveIndex = state.breweryCityFilter.findIndex( city => city === cityCheckbox.value)
            state.breweryCityFilter.splice(itemToRemoveIndex, 1)
            const filteredBreweries = state.breweries.filter( brewery => state.breweryCityFilter.includes(brewery.city))
            if (state.breweryCityFilter.length >= 1) {
              console.log(filteredBreweries)
              createsMainElements(filteredBreweries)
            } else {
              console.log(filteredBreweries)
              createsMainElements(state.breweries)
            }
          }
        }
      })

      const cityLabel = document.createElement("label")
      cityLabel.setAttribute("for", breweryCity)
      cityLabel.innerText = breweryCity
    
      filterByCityForm.append(cityCheckbox, cityLabel)
    }

  searchFilterEl.append(filterByTypeHeading, filterByTypeForm, filterByCityHeading, filterByCityForm)

  pageDisplayEl.append(searchFilterEl)
}

function typeMixedFilter () {
  if (state.breweryCityFilter.length >= 1) {
    let filteredBreweries = state.breweries.filter( brewery => state.breweryCityFilter.includes(brewery.city))
    console.log(filteredBreweries)
    filteredBreweries = filteredBreweries.filter( brewery => brewery.brewery_type === state.breweryTypeFilter)
    console.log(filteredBreweries)
    createsMainElements(filteredBreweries)
  } else {
    const filteredBreweries = state.breweries.filter( brewery => brewery.brewery_type === state.breweryTypeFilter)
    console.log(filteredBreweries)
    createsMainElements(filteredBreweries)
  }
}
