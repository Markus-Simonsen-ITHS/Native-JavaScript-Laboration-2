const url = "https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station/71420/period/latest-day/data.json"
const audio = new Audio('rain-01.mp3')
const weatherinfo = document.querySelector('#weatherInfo').children
let city = "Göteborg"
moment().format();

// Get the data from the url
function fetchData() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Extract the last 20 temperature values
            let temperatureValues = data.value.slice(-25)

            chartRenderer(temperatureValues)

            weatherinfo[0].textContent = `The temperature is ${temperatureValues[temperatureValues.length - 1].value}°C`

        })
}

const average = (array) => {
    let sum = 0
    for (let i = 0; i < array.length; i++) {
        sum += array[i]
    }
    return sum / array.length
}

// Run the fetchData function every 60 seconds
setInterval(fetchData, 60000)

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
    if (play) {
        audio.play()
    } else {
        audio.pause()
    }
}

// Convert city to coordinates
function getCoordinates(city) {
    const url = `https://nominatim.openstreetmap.org/search/${city}?format=json&limit=1`
    fetch(url)
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

getCoordinates(city)

// Get next rain
function getNextRain(lat, lon) {
    const url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`
    fetch(url)
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

            let nextRainDate = moment(new Date(nextRain.date))

            const humanReadableUntil = nextRainDate.fromNow()

            console.log(rainValues[0].value)

            // Check if it's raining
            if (rainValues[0].value > 0) {
                playPauseRain(true)
                weatherinfo[1].textContent = "It's currently precipitating"
            } else {
                playPauseRain(false)
                weatherinfo[1].textContent = `It will precipitation ${humanReadableUntil}`
            }

        })
}