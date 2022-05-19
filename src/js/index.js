const RENDER = {
    renderList(list) {
        return list.map(weather => {
            return (`
                <li>
                <div class="weather__hour">
                    ${this.getDate(weather.dt).toLocaleTimeString().slice(0,-3)}<br>
                    ${this.getDate(weather.dt).toLocaleDateString().bold()} 
                </div>
                <div class="weather__temp">
                    <img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}.png" alt="img">
                    <div class="weather__celcius">
                        <b>${Math.floor((typeof weather.temp === 'number' ? weather.temp : weather.temp.day) - 273)}°</b>
                    </div>
                </div>
            </li> 
            `);
        }).join('');
    },
    renderTodayDate(data) {
        return this.renderList(data.hourly);
    },
    renderWeekDate(data) {
        return this.renderList(data.daily);
    },
    fillTab(data) {
        const tabToday = document.getElementById('today');
        const tabWeek = document.getElementById('week');

        const contenToday = document.getElementById('weather-today-content');
        const contenWeek = document.getElementById('weather-week-content');

        tabToday.addEventListener('click', e => {
            e.preventDefault();
            tabToday.classList.add('active');
            tabWeek.classList.remove('active');

            contenToday.removeAttribute('hidden');
            contenToday.innerHTML = this.renderTodayDate(data);
            contenWeek.setAttribute('hidden', true);
        });

        tabWeek.addEventListener('click', e => {
            e.preventDefault();
            tabWeek.classList.add('active');
            tabToday.classList.remove('active');

            contenWeek.removeAttribute('hidden');
            contenWeek.innerHTML = this.renderWeekDate(data);
            contenToday.setAttribute('hidden', true);
        });

        tabToday.click();
    },
    ready() {
        const loader = document.getElementById('page-loader');

        if (loader) {
            loader.classList.remove('open');
        }
    },
    getDate(dt) {
        const date = new Date(dt * 1000);

        return date;
    },
    base(weatherData) {
        const city = document.getElementById('city');
        const country = document.getElementById('country');
        const time = document.getElementById('time');
        const date = document.getElementById('date');
        const temperature = document.getElementById('temperature');
        const icon = document.querySelector('#icon img');
        const weatherDescription = document.getElementById('weather-description');

        const [currentWeather] = weatherData.weather;

        city.innerHTML = weatherData.name;
        country.innerHTML = weatherData.sys.country;
        time.innerHTML = this.getDate(weatherData.dt).toLocaleTimeString();
        date.innerHTML = this.getDate(weatherData.dt).toUTCString().slice(0,-13);
        temperature.innerHTML = Math.floor(weatherData.main.temp - 273) + '°';

        console.log(currentWeather.icon);

        icon.src = `http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`;
        weatherDescription.innerHTML = currentWeather.description;
    }
}

const APP = {
    init(event) {
        const weather = JSON.parse(event.target.response)

        RENDER.base(weather);
        RENDER.ready();

        API.getForecastWeather({
            lat: weather.coord.lat,
            lon: weather.coord.lon
        }, forecastEvent => {
            RENDER.fillTab(JSON.parse(forecastEvent.target.response));
        });
    },
    initWithCoordinates(lat, lon) {
        API.getCurrentWeather({ lat, lon }, (event) => this.init(event));
    },
    initWithCityName() {
        const cityName = prompt('Enter your city name');

        API.getCurrentWeather({ q: cityName }, (event) => this.init(event));
    }
}

function success(pos) {
    const crd = pos.coords;

    const lat = crd.latitude;
    const lon = crd.longitude;

    if (lat && lon) {
        APP.initWithCoordinates(lat, lon);
    }
}

function error() {
    console.log('Location not detected');

    APP.initWithCityName()
}

navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
});


// Animated Background

let colors = new Array(
    [245, 247, 247],
    [200, 221, 224],
    [245, 247, 247],
    [182, 203, 219],
    [245, 247, 247],
    [134, 184, 207]);

let step = 0;
//color table indices for: 
// current color left
// next color left
// current color right
// next color right
let colorIndices = [0, 1, 2, 3];

//transition speed
let gradientSpeed = 0.002;

function updateGradient() {

    if ($ === undefined) return;

    let c0_0 = colors[colorIndices[0]];
    let c0_1 = colors[colorIndices[1]];
    let c1_0 = colors[colorIndices[2]];
    let c1_1 = colors[colorIndices[3]];

    let istep = 1 - step;
    let r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
    let g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
    let b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
    let color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

    let r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
    let g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
    let b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
    let color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";

    $('#gradient').css({
        background: "-webkit-gradient(linear, left top, right top, from(" + color1 + "), to(" + color2 + "))"
    }).css({
        background: "-moz-linear-gradient(left, " + color1 + " 0%, " + color2 + " 100%)"
    });

    step += gradientSpeed;
    if (step >= 1) {
        step %= 1;
        colorIndices[0] = colorIndices[1];
        colorIndices[2] = colorIndices[3];

        //pick two new target color indices
        //do not pick the same as the current one
        colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
        colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;

    }
}

setInterval(updateGradient, 10);