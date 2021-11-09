const mainList = document.querySelector('#mainList');
const search = document.querySelector('#city');

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
    },
    {
        cityName: "Örebro",
        id: 95130
    },
    {
        cityName: "Helsingborg",
        id: 62040
    },
    {
        cityName: "Jönköping",
        id: 74460
    },
    {
        cityName: "Umeå",
        id: 140480
    }
]

// Sort cities alphabetically
cityList.sort(function (a, b) {
    if (a.cityName < b.cityName) {
        return -1;
    }
    if (a.cityName > b.cityName) {
        return 1;
    }
    return 0;
});

// create list of cities
function createList(cityList) {
    mainList.innerHTML = '';

    // Check if search is empty
    if (cityList.length === 0) {
        mainList.innerHTML = '<p>No results found</p>';
    } else {
        cityList.forEach(city => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="weather/index.html?id=${city.id}&cityName=${city.cityName}">${city.cityName}</a>`;
            mainList.appendChild(li);
        });
    }
}

createList(cityList);

// Search for city
search.addEventListener('input', function (e) {
    const searchValue = e.target.value.toLowerCase();
    const filteredList = cityList.filter(function (city) {
        return city.cityName.toLowerCase().includes(searchValue);
    });
    createList(filteredList);
});