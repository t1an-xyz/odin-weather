# Weather App
A weather app created for [The Odin Project](https://www.theodinproject.com). To use this, create a file in the root directory called `api_key.js` with the following contents:
```
const GEO_API_KEY = API key for Open Weather Map
const WEATHER_API_KEY = API key for Visual Crossing
```
[Open Weather Map](https://openweathermap.org) is used to decode the coordinates into a city name. [Visual Crossing](https://www.visualcrossing.com) is used for the weather data because it gives richer details than Open Weather Map, such as sunrise/sunset times.