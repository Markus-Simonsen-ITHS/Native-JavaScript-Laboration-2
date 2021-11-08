const apiUrl = "https://avancera.app/cities/"

window.onload = function () {
    getCities()

    // Run getCities() every 20 seconds
    setInterval(getCities, 20000)

    // Run addCity on submit of addCityForm
    document.querySelector("#addCityForm").addEventListener("submit", addCity)
}

// Gets all cities from the API
async function getCities() {
    const response = await fetch(apiUrl)
    const cities = await response.json()
    const cityContainer = document.querySelector("#CitiesList")
    cityContainer.innerHTML = ""
    cities.forEach(createCityDom)
}

// Create a city DOM element
function createCityDom(city) {
    const cityContainer = document.querySelector("#CitiesList")
    const cityElement = document.createElement("div")
    cityElement.classList.add("city")
    cityElement.innerHTML = `
        <h2>${city.name}</h2>
        <p>${Intl.NumberFormat().format(city.population)}</p>

    `
    cityContainer.appendChild(cityElement)
}

// Change hidden status on modal
function showModal(hidden) {
    const modal = document.querySelector("#modal")
    if (!hidden) {
        modal.hidden = true
    } else {
        modal.hidden = false
    }
}

// Add a new city
async function addCity(e) {
    e.preventDefault()
    const cityName = document.querySelector("#cityName").value
    const cityPopulation = document.querySelector("#cityPopulation").value
    const city = {
        name: cityName,
        population: parseInt(cityPopulation) 
    }
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {

            "Content-Type": "application/json"
        },
        body: JSON.stringify(city)
    })

    const data = await response.json()

    if(data.error) {
        alert(data.error)
    } else {
        getCities()
    }
}