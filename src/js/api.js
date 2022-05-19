const APP_ID = '18cfd6a9c0c00fa65fddb33e2ec3981a';

const errorHandler = () => {
    alert('API call failed');
}

const API = {
    lang: 'en',
    baseURL: 'https://api.openweathermap.org/data',
    version: '2.5',
    constructURL(path, queryParams) {
        const url = new URL(`${this.baseURL}/${this.version}/${path}`)

        url.searchParams.append('appid', APP_ID);
        url.searchParams.append('lang', this.lang);

        Object.keys(queryParams)
            .forEach(qParam => url.searchParams.append(qParam, queryParams[qParam]));

        return url.toString();
    },
    perform(url, success, error = errorHandler) {
        const request = new XMLHttpRequest();

        request.open('GET', url);

        request.send();

        request.addEventListener('load', success);
        request.addEventListener('error', error);
    },
    getCurrentWeather(queryParams, successCb) {
        const requestURL = this.constructURL('weather', queryParams);

        this.perform(requestURL, successCb);
    },
    getForecastWeather(queryParams, successCb) {
        const requestURL = this.constructURL('onecall', queryParams);

        this.perform(requestURL, successCb);
    }
}