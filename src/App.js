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
  const [placeDesc, setDesc] = useState({});
  const [places, setPlaces] = useState({});


  let maxShown = 10;
  let shownOnPage = 10;

  // var placesArray;

  const loadMore = () => {
    maxShown += 10;
    loadDescriptions(places);
  }

  const search = evt => {
      if (evt.key === "Enter") {
          setCoords({});
          setAttractions({});
          if (query.length > 0){
            loadWeather();
            let coordinates = loadCoordinades();
            coordinates.then( point => loadAttractions(point));
            // placesArray = Array.from(placesArray, feature => feature);
            loadDescriptions(places);
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
      placesArray.slice(maxShown - shownOnPage, maxShown).forEach(newPlace => {
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

  function loadAttractions(point){
      setCoords(point);
      openTripApi.fetchPlaces(point)
      .then(res => res.json())
      .then(result => {
        if (!('error' in result)){
          setAttractions(result);
          setPlaces( arr => [ ... arr, Array.from(attractions?.features, feature => feature?.properties?.xid)]);                    
        }
      });
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
            <Attractions attr={attractions} placeDesc={placeDesc} maxShown={maxShown} shownOnPage={shownOnPage}/>
            
            <button onClick={loadMore}>
              Load More...
            </button>
          </div>
        ) : (
          <div className="welcomePage">
            <div className="header">Find your city!</div>
            <div>This website desplays weather, attractions and coordinates of given place. Type in a place to explore it!</div>
          </div>
        )}

        
      
      </main>
    </div>
  );
}

export default App;