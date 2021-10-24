import React, {
  useState
} from 'react';
import WeatherBox from './components/WeatherBox';
import Attractions from './components/Attractions';


import {
  OPENWEATHER_API_KEY,
  GRAPH_HOPPER_API_KEY,
  OPENTRIP_MAP_API_KEY
} from './config/keys';

const weatherApi = {
  key: OPENWEATHER_API_KEY,
  base: "https://api.openweathermap.org/data/2.5/"
}

const geotagApi = {
  key: GRAPH_HOPPER_API_KEY,
  base: "https://graphhopper.com/api/1/"
}

const placesApi = {
  key: OPENTRIP_MAP_API_KEY,
  base: "https://api.opentripmap.com/0.1/en/"
}

function App() {

  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [attr, setAttr] = useState({});
  const [coords, setCoords] = useState({});
  const [placeDesc, setDesc] = useState({});

  const search = evt => {
      if (evt.key === "Enter") {
          setCoords({});

          loadWeather();
          let coordinates = loadCoordinades();
          loadAttractions(coordinates);
      }
  }

  function loadWeather() {
      fetch(`${weatherApi.base}weather?q=${query}&units=metric&APPID=${weatherApi.key}`)
          .then(res => res.json())
          .then(result => {
              setWeather(result);
          });
  }

  function loadCoordinades() {
      let coordinates = new Promise((resolve, reject) => {
          setTimeout(() => {
              fetch(`${geotagApi.base}geocode?q=${query}&locale=en&key=${geotagApi.key}`)
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
      placesArray.forEach(newPlace => {
          console.log("xid", newPlace);
          fetch(`${placesApi.base}places/xid/${newPlace}?apikey=${placesApi.key}`)
              .then(res => res.json())
              .then(result => {
                  console.log("res", result);
                  setDesc((prevDesc) => {
                      return {
                          ...prevDesc,
                          [result.name]: result
                      }
                  });
              });
      });
  }

  function loadAttractions(coordinates){
    coordinates
      .then(
          point => {
            setCoords(point);
            fetch(`${placesApi.base}places/radius?radius=1000&lon=${point?.lng}&lat=${point?.lat}&apikey=${placesApi.key}`)
            .then(res => res.json())
            .then(result => {
              setAttr(result);
              setQuery('');

              let placesID = new Promise((resolve, reject) => {
                resolve(
                  Array.from(result.features, feature => feature?.properties?.xid)
                )
              });

              placesID
                .then(
                  placesArray => {
                    loadDescriptions(placesArray);                    
                  }
                );
            });
          }
      );
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
        {("main" in weather)
          ? 
          <WeatherBox coords={coords} weather={weather}/>
          :
          <span/>
        }

        {("features" in attr) ? (
          <Attractions attr={attr} placeDesc={placeDesc}/>
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
