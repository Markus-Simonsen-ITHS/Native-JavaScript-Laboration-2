// Get url params
const urlParams = new URLSearchParams(window.location.search)

const url = `https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station/${urlParams.get("id")}/period/latest-day/data.json`
const audio = new Audio('rain-01.mp3')
const weatherinfo = document.querySelector('#weatherInfo').children
let city = urlParams.get("cityName")
moment().format();
let loadingNumber = 0

const hideLoading = (remove, number) => {
    if (remove) {
        loadingNumber -= number
    } else {
        loadingNumber += number
    }

    if (loadingNumber == 0) {
        console.log("Loading done")
        document.querySelector('#loading').classList.add('loadingHidden')
    } else {
        console.log("Loading in progress")
        document.querySelector('#loading').classList.remove('loadingHidden')
    }
}

document.querySelector('#City').textContent = city

// Get the data from the url
function fetchData() {
    hideLoading(false, 1)
    fetch(url, {
        method: 'GET',
        cache: "no-store",
    })
        .then(response => response.json())
        .then(data => {
            // Extract the last 20 temperature values
            let temperatureValues = data.value.slice(-25)

            chartRenderer(temperatureValues)

            weatherinfo[0].textContent = `The current temperature is ${temperatureValues[temperatureValues.length - 1].value}°C`

            hideLoading(true, 1)
        }).catch(err => {
            weatherinfo[0].textContent = "Failed to get temperature, please try again"
            weatherinfo[0].className = "error"
            hideLoading(true, 1)
        })
}

const average = (array) => {
    let sum = 0
    for (let i = 0; i < array.length; i++) {
        sum += array[i]
    }
    return sum / array.length
}

fetchData()

function chartRenderer(smhiObject) {
    // Create a new chart
    const temps = smhiObject.map(obj => obj.value)
    const dates = smhiObject.map(obj => obj.date)
    const labels = dates.map(unixToISO)

    const obj = {
        chart: {
            type: 'line'
        },
        stroke: {
            curve: 'straight',
        },
        series: [
            {
                name: 'Temperature',
                data: temps
            }
        ],
        xaxis: {
            categories: labels
        },
        colors: ['#0066ff']
    }

    const chart = new ApexCharts(document.querySelector('#chart'), obj)

    chart.render()
}

// Unix time to LocaleTimeString
function unixToISO(unix) {
    let date = new Date(unix)
    return date.toLocaleTimeString().slice(0, -3)
}

function playPauseRain(play) {
    // Set volume of audio
    audio.volume = 0.25

    // Loop audio
    audio.loop = true

    if (play) {
        audio.play()
    } else {
        audio.pause()
    }
}

// Convert city to coordinates
function getCoordinates(city) {
    hideLoading(false, 1)
    const url = `https://nominatim.openstreetmap.org/search/${city}?format=json&limit=1`
    fetch(url, {
        method: 'GET',
        cache: "force-cache",
    })
        .then(response => response.json())
        .then(data => {
            let lat = data[0].lat
            let lon = data[0].lon

            // Remove decimals from coordinates
            lat = parseFloat(lat).toFixed(3)
            lon = parseFloat(lon).toFixed(3)

            getNextRain(lat, lon)

        })
}

setInterval(() => {
    getCoordinates(city);
    fetchData()
}, 60000)

getCoordinates(city)

// Get next rain
function getNextRain(lat, lon) {
    const url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`
    fetch(url, {
        method: 'GET',
        cache: "no-store",
    })
        .then(response => response.json())
        .then(data => {

            let rainArray = data.timeSeries

            let paramArray = []

            // Create array of objects with only parameters
            for (let index = 0; index < rainArray.length; index++) {
                paramArray.push(rainArray[index].parameters)

            }

            let rainValues = []

            for (let index = 0; index < paramArray.length; index++) {
                // Get index of element with name pmean
                let pmeanIndex = paramArray[index].findIndex(obj => obj.name === "pmean")

                // Get the value of pmean
                let pmeanValue = paramArray[index][pmeanIndex].values[0]

                rainValues.push({
                    value: pmeanValue,
                    date: rainArray[index].validTime
                })

            }

            let rain = rainValues.filter(obj => obj.value > 0)

            let nextRain = rain[0]

            let nextRainDate = new Date(nextRain.date)

            let nextRainDateMoment = moment(nextRainDate)

            const humanReadableUntil = nextRainDateMoment.fromNow()

            console.log()

            // Check if it's raining
            if (new Date().toLocaleTimeString().slice(0, -6) == nextRainDate.toLocaleTimeString().slice(0, -6)) {
                playPauseRain(true)
                weatherinfo[1].textContent = "It's currently precipitating"
            } else {
                playPauseRain(false)
                weatherinfo[1].textContent = `It will precipitate ${humanReadableUntil}`

                // Check if nextRain.date is today
                if (nextRainDate.getDay() === new Date().getDay()) {
                    weatherinfo[1].textContent += `, that's today at ${nextRainDate.toLocaleTimeString().slice(0, -3)}`
                }
                if (nextRainDate.getDay() === new Date().getDay() + 1) {
                    weatherinfo[1].textContent += `, that's tomorrow at ${nextRainDate.toLocaleTimeString().slice(0, -3)}`
                }
            }
            hideLoading(true, 1)

        }).catch(err => {
            weatherinfo[1].textContent = "Failed to get precipitation forecast, please try again"
            weatherinfo[1].className = "error"
            hideLoading(true, 1)
            console.log(err)
        })
}