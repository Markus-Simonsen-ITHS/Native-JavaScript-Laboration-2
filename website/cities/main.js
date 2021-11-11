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
        <button class="delete" onclick="deleteCity('${city.id}', this)">Delete</button>
        <button class="edit" onclick="editCity('${city.id}', this, '${city.name}', '${city.population}')">Edit</button>
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
    const cityId = document.querySelector("#cityId").value

    let data

    if (cityId.length === 0) {
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
        data = await response.json()

        document.querySelector("#cityName").value = ""
        document.querySelector("#cityPopulation").value = ""
        document.querySelector("#cityId").value = ""
    } else {
        const city = {
            name: cityName,
            population: parseInt(cityPopulation),
            id: cityId
        }
        const response = await fetch(apiUrl + cityId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(city)
        })

        data = await response.text()

        document.querySelector("#cityName").value = ""
        document.querySelector("#cityPopulation").value = ""
        document.querySelector("#cityId").value = ""
    }


    if (data.error) {
        alert(data.error)
    } else {
        getCities()
    }
}

// Delete a city
async function deleteCity(id, button) {
    button.disabled = true

    const response = await fetch(apiUrl + id, {
        method: "DELETE"
    })
    const data = await response.text()
    if (data.error) {
        alert(data.error)
    } else {
        getCities()
    }
}

// Edit a city
async function editCity(id, button, name, population) {
    document.querySelector("#cityName").value = name
    document.querySelector("#cityPopulation").value = population
    document.querySelector("#cityId").value = id

    if (document.querySelector("#cityId").value.length === 0) {
        document.querySelector("#submitButton").value = "Add city"
    } else {
        document.querySelector("#submitButton").value = "Update city"
    }

    document.querySelector("#addCityForm").style.animation = ""

    setTimeout(() => {
        document.querySelector("#addCityForm").style.animation = "bounce .5s"
    }, 1)

    
}