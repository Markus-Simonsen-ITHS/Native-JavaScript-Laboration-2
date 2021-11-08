const mainList = document.querySelector('#mainList');

let cityList = [
    {
        cityName: "Göteborg",
        id: 71420
    },
    {
        cityName: "Stockholm",
        id: 98230
    },
    {
        cityName: "Malmö",
        id: 52350
    },
    {
        cityName: "Uppsala",
        id: 97510
    },
    {
        cityName: "Eskilstuna",
        id: 96190
    },
    {
        cityName: "Luleå",
        id: 162860
    }
]

// Sort cities alphabetically
cityList.sort(function(a, b) {
    if (a.cityName < b.cityName) {
        return -1;
    }
    if (a.cityName > b.cityName) {
        return 1;
    }
    return 0;
});

cityList.forEach(city => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="weather/index.html?id=${city.id}&cityName=${city.cityName}">${city.cityName}</a>`;
    mainList.appendChild(li);
});