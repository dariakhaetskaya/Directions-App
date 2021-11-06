import React, {useState} from 'react';
import WeatherBox from './components/WeatherBox';
import Attractions from './components/Attractions';
import {openWeatherApi} from './apiHandling/openWeatherApi';
import {geotagApi} from './apiHandling/geotagApi';
import {openTripApi} from './apiHandling/openTripApi';

function App() {

    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState({});
    const [attractions, setAttractions] = useState({});
    const [coords, setCoords] = useState({});
    const [placeDesc, setDesc] = useState([]);
    const [places, setPlaces] = useState([]);
    const [maxShown, setMaxShown] = useState(10);

    let loadAtOnce = 10;

    function loadMore() {
        setMaxShown(prevMaxShown => prevMaxShown + 10);
        loadDescriptions(places);
    }

    function search(event) {
        if (event.key === "Enter") {
            setCoords({});
            setAttractions({});
            setMaxShown(10);
            if (query.length > 0) {
                loadWeather();
                loadCoordinates().then(point => loadAttractions(point));
            }
        }
    }

    function loadWeather() {
        openWeatherApi.fetchOpenWeatherApi(query)
            .then(res => res.json())
            .then(result => {
                setWeather(result);
            });
    }

    function loadCoordinates() {
        return geotagApi.fetchCoordinates(query)
            .then(res => res.json())
            .then(result => {
                setQuery('');
                return result.hits[0]?.point;
            });
    }

    function loadDescriptions(placesArray) {
        placesArray.slice(maxShown - loadAtOnce, maxShown).forEach(newPlace => {
            openTripApi.fetchDescription(newPlace)
                .then(res => res.json())
                .then(result => {
                    setDesc((prevDesc) => {
                        return {
                            ...prevDesc,
                            [result.name]: result
                        }
                    });
                });
        });
    }

    async function loadAttractions(point) {
        setCoords(point);

        const response = await openTripApi.fetchPlaces(point);
        const result = await response.json();
        if (!('error' in result)) {
            setAttractions(result);
            const newPlaces = (result?.features).map(feature => feature?.properties?.xid)
            setPlaces(newPlaces);
            loadDescriptions(newPlaces);
        }
    }

    function isWeatherPresent(weather) {
        return 'main' in weather;
    }

    function areAttractionPresent(attractions) {
        return 'features' in attractions;
    }

    return (
        <div className="app">
            <main>
                <div className="search-box">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search..."
                        onChange={event => setQuery(event.target.value)}
                        value={query}
                        onKeyPress={search}
                    />
                </div>
                {(isWeatherPresent(weather))
                    ?
                    <WeatherBox coords={coords} weather={weather}/>
                    :
                    <span/>
                }

                {(areAttractionPresent(attractions)) ? (
                    <div>
                        <Attractions attr={attractions} placeDesc={placeDesc} maxShown={maxShown}
                                     loadAtOnce={loadAtOnce}/>

                        <button onClick={loadMore}>
                            Load More...
                        </button>
                    </div>
                ) : (
                    <div className="welcomePage">
                        <div className="header">Find your city!</div>
                        <div>This website displays weather, attractions and coordinates of given place. Type in a place
                            to explore it!
                        </div>
                    </div>
                )}


            </main>
        </div>
    );
}

export default App;