function weatherWidget() {
    const buttons = document.querySelectorAll('.btn');

    window.addEventListener('load', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                let lon = position.coords.longitude;
                let lat = position.coords.latitude;
                const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=011ef9d51de649b778b657df56e8672d`;

                let fetchLocation = [];
                async function handleFetchRequest(url) {
                    try {
                        const response = await fetch(url);
                        fetchLocation = await response.json();
                    } catch (error) {
                        return fetchLocation;
                    }
                }

                const displayWidgetInformation = async () => {
                    await handleFetchRequest(url);
                    currentWeather(fetchLocation);
                };

                displayWidgetInformation();
            });
        }
    });

    if (!!buttons) {
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                async function searchByCity() {
                    const city = document.getElementById('input').value;
                    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=011ef9d51de649b778b657df56e8672d`;
        
                    let fetchSearch = [];
                    async function handleFetchRequest(url) {
                        try {
                            const response = await fetch(url);
                            fetchSearch = await response.json();
                        } catch (error) {
                            return fetchSearch;
                        }
                    }
        
                    await handleFetchRequest(url);
                    currentWeather(fetchSearch);
                }
    
                searchByCity();
            });
        });
    }

    function currentWeather(fetchCurrent) {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${fetchCurrent.name}&appid=011ef9d51de649b778b657df56e8672d`;

        fetchCurrent = [];
        async function handleFetchRequest(url) {
            try {
                const response = await fetch(url);
                fetchCurrent = await response.json();
            } catch (error) {
                return fetchCurrent;
            }
        }

        const displayWidgetInformation = async () => {
            await handleFetchRequest(url);
            const currentDay = document.querySelector('.current-day');
            const currentTemperature = Math.round(fetchCurrent.main.temp - 273.15) + `&deg;` + 'C';
            const feelsLikeTemperature = Math.round(fetchCurrent.main.feels_like - 273.15) + `&deg;` + 'C';
            const conditions = fetchCurrent.weather[0]['description'];
            const cityName = fetchCurrent.name;
            const currentPicture = fetchCurrent.weather[0]['icon'];
            let regionNames = new Intl.DisplayNames(['en'], {
                type: 'region'
            });
            const countryName = regionNames.of(fetchCurrent.sys.country);

            currentDay.innerHTML = `
            <div class="current-temp">
                <p class="temp">${currentTemperature}</p>
                <p class="feels-like">Feels like ${feelsLikeTemperature}</p>
            </div>
            <div class="current-city-conditions">
                <p class="conditions">${conditions}</p>
                <p class="city">${cityName}, ${countryName}</p>
            </div>
            <div class="current-pic">
                <img src="https://openweathermap.org/img/wn/${currentPicture}@2x.png">
            </div>
            `;

            futureWeather(fetchCurrent);
        };

        displayWidgetInformation();
    }

    function futureWeather(fetchFuture) {
        const url = `http://api.openweathermap.org/data/2.5/forecast/daily?q=${fetchFuture.name}&appid=011ef9d51de649b778b657df56e8672d`;

        fetchFuture = [];
        async function handleFetchRequest(url) {
            try {
                const response = await fetch(url);
                fetchFuture = await response.json();
            } catch (error) {
                return fetchFuture;
            }
        }

        const displayWidgetInformation = async () => {
            await handleFetchRequest(url);
            document.querySelector('.next-day').replaceChildren();
            
            for (let i = 1; i < 6; i++) {
                const nextDay = document.querySelector('.next-day');
                const dayName = new Date(fetchFuture.list[i].dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'short'
                });
                const currentPicture = fetchFuture.list[i].weather[0].icon;
                const conditions = fetchFuture.list[i].weather[0].description;
                const minTemperature = Math.round(fetchFuture.list[i].temp.min - 273.15) + `&deg;` + 'C';
                const maxTemperature = Math.round(fetchFuture.list[i].temp.max - 273.15) + `&deg;` + 'C';

                nextDay.innerHTML += `
                <div class="day-data">
                    <p class="day-name">${dayName}</p>
                    <div class="day-img">
                        <img src="https://openweathermap.org/img/wn/${currentPicture}@2x.png">
                    </div>
                    <p class="conditions">${conditions}</p>
                    <div class="minmax-temperature">
                        <p class="min-temp">${minTemperature}</p>
                        <p class="max-temp">${maxTemperature}</p>
                    </div>
                </div>
                `;
            }
        };

        displayWidgetInformation();
    }
}

document.addEventListener('DOMContentLoaded', weatherWidget);