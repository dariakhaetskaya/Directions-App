import {
    OPENWEATHER_API_KEY,
} from '../config/keys';

const weatherApi = {
    key: OPENWEATHER_API_KEY,
    base: "https://api.openweathermap.org/data/2.5/"
}

function fetchOpenWeatherApi(query) {
    return fetch(`${weatherApi.base}weather?q=${query}&units=metric&APPID=${weatherApi.key}`);
}

export const openWeatherApi = {
    fetchOpenWeatherApi,
};