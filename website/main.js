const mainList = document.querySelector('#mainList');
const recentDom = document.querySelector('#recent');
const recentList = "recentlist";
const search = document.querySelector('#city');

search.focus();

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

window.addEventListener('resize', () => {
    createList(cityList);
    search.value = ""
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
            li.innerHTML = `<a href="weather/index.html?id=${city.id}&cityName=${city.cityName}" onclick='addToRecent(event);'>${city.cityName}</a>`;
            mainList.appendChild(li);
        });
    }

    // Check width of window
    const width = window.innerWidth;

    // Check if recents are empty 
    if (localStorage.getItem(recentList) === null || width < 560) {
        recentDom.innerHTML = '';
    } else {
        const recentListObj = JSON.parse(localStorage.getItem(recentList));
        recentDom.innerHTML = '';
        let recentText = document.createElement('p');
        recentText.innerHTML = 'Recent:';
        recentDom.appendChild(recentText);
        recentListObj.forEach(city => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="weather/index.html?id=${city.id}&cityName=${city.cityName}" onclick='addToRecent(event);'>${city.cityName}</a>`;
            recentDom.appendChild(li);
        });
    }
}

// Runs when user clicks link
function addToRecent(ev) {
    const cityName = ev.target.text;
    const id = ev.target.href.split('=')[1].split('&')[0];
    let recentListObj = JSON.parse(localStorage.getItem(recentList));

    if (recentListObj === null) {
        recentListObj = [];
    }

    // Check if city is already in recents and add it to start of list
    if (recentListObj !== null || recentListObj.length > 0) {
        if (recentListObj.find(city => city.id === id)) {
            recentListObj.splice(recentListObj.indexOf(recentListObj.find(city => city.id === id)), 1);
        }
    }

    // Add city to start of list
    recentListObj.unshift({
        cityName: cityName,
        id: id
    });

    // Limit list to 3 items
    if (recentListObj.length > 3) {
        recentListObj.pop();
    }

    // Save list to local storage
    localStorage.setItem(recentList, JSON.stringify(recentListObj));
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