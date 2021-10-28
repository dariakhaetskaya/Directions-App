import React, { useState } from 'react';
import WeatherBox from './components/WeatherBox';
import Attractions from './components/Attractions';
import { openWeatherApi } from './apiHandling/openWeatherApi';
import { geotagApi } from './apiHandling/geotagApi';
import { openTripApi } from './apiHandling/openTripApi';

function App() {

  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [attractions, setAttractions] = useState({});
  const [coords, setCoords] = useState({});
  const [placeDesc, setDesc] = useState([]);
  const [places, setPlaces] = useState([]);
  const [maxShown, setMaxShown] = useState(10);

  let loadAtOnce = 10;

  const loadMore = () => {
    setMaxShown(prevMaxShown => prevMaxShown + 10);
    loadDescriptions(places);
  }

  const search = evt => {
      if (evt.key === "Enter") {
          setCoords({});
          setAttractions({});
          setMaxShown(10);
          if (query.length > 0){
            loadWeather();
            let coordinates = loadCoordinades();
            coordinates.then( point => loadAttractions(point));
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

  function loadCoordinades() {
      let coordinates = new Promise((resolve, reject) => {
          setTimeout(() => {
              geotagApi.fetchCoordinates(query)
                  .then(res => res.json())
                  .then(result => {
                      setQuery('');
                      resolve(result.hits[0]?.point);
                  });
          }, 100);
      });
      return coordinates;
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

 async function loadAttractions(point){
      setCoords(point);

      const response = await openTripApi.fetchPlaces(point);
      const result = await response.json();
      if (!('error' in result)){
        setAttractions(result);
        const newPlaces = (result?.features).map(feature => feature?.properties?.xid)
        setPlaces(newPlaces);
        loadDescriptions(newPlaces);
      }
  }  

  return (
    <div className="app">
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
            />
        </div>
        {('main' in weather)
          ? 
          <WeatherBox coords={coords} weather={weather}/>
          :
          <span/>
        }

        {('features' in attractions) ? (
          <div>
            <Attractions attr={attractions} placeDesc={placeDesc} maxShown={maxShown} loadAtOnce={loadAtOnce}/>
            
            <button onClick={loadMore}>
              Load More...
            </button>
          </div>
        ) : (
          <div className="welcomePage">
            <div className="header">Find your city!</div>
            <div>This website displays weather, attractions and coordinates of given place. Type in a place to explore it!</div>
          </div>
        )}

        
      
      </main>
    </div>
  );
}

export default App;