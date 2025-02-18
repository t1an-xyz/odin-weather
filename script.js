const CityTextBox = document.getElementById('city');
const ConditionTextBox = document.getElementById('condition');
const LowHighTextBox = document.getElementById('low-high');
const Switch = document.querySelector('.switch');
const TemperatureTextBox = document.getElementById('temperature');
const Body = document.querySelector('body');

const CLEAR_DAY_BACKGROUND = 'linear-gradient(0deg,rgb(185, 218, 245) 0%,rgb(145, 187, 235) 100%)';
const CLEAR_NIGHT_BACKGROUND = 'linear-gradient(0deg,rgb(19, 16, 37) 0%,rgb(26, 25, 34) 100%)';
const CLOUDY_BACKGROUND = 'linear-gradient(0deg,rgb(154, 154, 155) 0%,rgb(132, 132, 133) 100%)'

let temperatureInFahrenheit = 0;
let lowInFahrenheit = 0;
let highInFahrenheit = 0;

let isCelsius = true;

function convertTemperature(temp) {
    return Math.round(isCelsius ? (temp - 32) * 5 / 9 : temp);
}

navigator.geolocation.getCurrentPosition(pos => {
    fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&limit=1&appid=${GEO_API_KEY}`)
        .then(response => response.json()).then(data => {
            CityTextBox.textContent = data[0].name;
            document.title = `Weather in ${data[0].name}`;
        });
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${pos.coords.latitude},${pos.coords.longitude}?key=${WEATHER_API_KEY}`)
        .then(response => response.json()).then(data => {
            temperatureInFahrenheit = data.days[0].temp;
            TemperatureTextBox.textContent = convertTemperature(temperatureInFahrenheit) + 'º';

            let conditionText = '';
            switch (data.days[0].icon) {
                case 'snow':
                    conditionText = '❄️';
                    break;
                case 'rain':
                    conditionText = '🌧️';
                    break;
                case 'clear-day':
                    conditionText = '☀️';
                    break;
                case 'clear-night':
                    if (data.days[0].moonphase <= 0.0625 || data.days[0].moonphase >= 0.9375) {
                        conditionText = '🌑';
                    } else if (data.days[0].moonphase <= 0.1875) {
                        conditionText = '🌘';
                    } else if (data.days[0].moonphase <= 0.3125) {
                        conditionText = '🌗';
                    } else if (data.days[0].moonphase <= 0.4375) {
                        conditionText = '🌖';
                    } else if (data.days[0].moonphase <= 0.5625) {
                        conditionText = '🌕';
                    } else if (data.days[0].moonphase <= 0.6875) {
                        conditionText = '🌔';
                    } else if (data.days[0].moonphase <= 0.8125) {
                        conditionText = '🌓';
                    } else {
                        conditionText = '🌒';
                    }
                    break;
                case 'fog':
                    conditionText = '☁️';
                    break;
                case 'wind':
                    conditionText = '💨';
                    break;
                case 'cloudy':
                    conditionText = '☁️';
                    break;
                case 'partly-cloudy-day':
                    conditionText = '⛅';
                    break;
                case 'partly-cloudy-night':
                    conditionText = '⛅';
                    break;
            }
            conditionText += ' ' + data.days[0].conditions;
            ConditionTextBox.textContent = conditionText;

            lowInFahrenheit = data.days[0].tempmin;
            highInFahrenheit = data.days[0].tempmax;
            LowHighTextBox.textContent = `Low: ${convertTemperature(lowInFahrenheit)}º | High: ${convertTemperature(highInFahrenheit)}º`;

            const SUNRISE_TIME = new Date(data.days[0].sunriseEpoch * 1000);
            const SUNSET_TIME = new Date(data.days[0].sunsetEpoch * 1000);
            console.log(SUNRISE_TIME);
            console.log(data.days[0].sunriseEpoch);
            if (new Date() > SUNSET_TIME || new Date() < SUNRISE_TIME) {
                Body.style.background = CLEAR_NIGHT_BACKGROUND;
                Body.style.setProperty('--textColor', 'white');
            } else if (data.days[0].icon === 'cloudy' | data.days[0].icon === 'snow' | data.days[0].icon === 'rain' 
                        | data.days[0].icon === 'fog') {
                Body.style.background = CLOUDY_BACKGROUND;
            } else {
                Body.style.background = CLEAR_DAY_BACKGROUND;
            }
        });
});

Switch.addEventListener('click', () => {
    isCelsius = !isCelsius;
    TemperatureTextBox.textContent = convertTemperature(temperatureInFahrenheit) + 'º';
    LowHighTextBox.textContent = `Low: ${convertTemperature(lowInFahrenheit)}º | High: ${convertTemperature(highInFahrenheit)}º`;
    Switch.classList.toggle('toggled');
});