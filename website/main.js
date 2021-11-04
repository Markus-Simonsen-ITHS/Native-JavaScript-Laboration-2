const url = "https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station/71420/period/latest-day/data.json"
const rainUrl = "https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/7/station/71420/period/latest-hour/data.json"
let audio = new Audio('rain-01.mp3')

// Get the data from the url
function fetchData() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Extract the last 20 temperature values
            let temperatureValues = data.value.slice(-20)

            // Print temperature values to console
            console.log(temperatureValues)

            chartRenderer(temperatureValues)

        })
}

// Get rain data from url
async function fetchRainData() {
    let response = await fetch(rainUrl)
    let data = await response.json()
    let rainValues = data.value.slice(-20)
    if (rainValues[rainValues.length - 1].value > 0) {
        playPauseRain(true)
    } else {
        playPauseRain(false)
    }
}

fetchRainData()

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
    return date.toLocaleTimeString()
}

function playPauseRain(play) {
    if (play) {
        audio.play()
    } else {
        audio.pause()
    }
}
