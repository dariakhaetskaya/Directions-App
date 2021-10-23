import React, { useState } from 'react';
import WeatherBox from './components/WeatherBox';

const weatherApi = {
  key: "14dedf519011f34668bf4ff663d2aae5",
  base: "https://api.openweathermap.org/data/2.5/"
}

const geotagApi = {
  key: "4deef5d4-34c1-4f49-aad5-356d38b1c004",
  base: "https://graphhopper.com/api/1/"
}

const placesApi = {
  key: "5ae2e3f221c38a28845f05b6c6f136e441693c38c216adc8d23c1487",
  base: "https://api.opentripmap.com/0.1/en/"
}

function App() {

  const[query, setQuery] = useState('');
  const[weather, setWeather] = useState({});
  const[attr, setAttr] = useState({});
  const[coords, setCoords] = useState({});
  const[placeDesc, setDesc] = useState({});
  
  function loadWeather(){
      setCoords({});
      fetch(`${weatherApi.base}weather?q=${query}&units=metric&APPID=${weatherApi.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
      });
  }

  function loadCoordinades(){
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

  const search = evt => {
    if(evt.key === "Enter"){
      loadWeather();
      let coordinates = loadCoordinades();
      var placesID;
      
      coordinates
        .then(
            point => {
              setCoords(point);
              fetch(`${placesApi.base}places/radius?radius=10000&lon=${point?.lng}&lat=${point?.lat}&apikey=${placesApi.key}`)
              .then(res => res.json())
              .then(result => {
                setAttr(result);
                setQuery('');

                placesID = new Promise((resolve, reject) => {
                  resolve(
                    Array.from(result.features, feature => feature?.properties?.xid)
                  )
                });

                placesID
                  .then(
                    placesArray => {
                      console.log("placws arr", placesArray);
                      placesArray.forEach(newPlace => {
                        console.log("xid", newPlace);
                        fetch(`${placesApi.base}places/xid/${newPlace}?apikey=${placesApi.key}`)
                        .then(res => res.json())
                        .then(result => {
                          console.log("res", result);
                          setDesc((prevDesc) => {return {...prevDesc, [result.name] : result}});
                        });
                      });
                    }
                  );
              });
            }
        );

      console.log(placesID);

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
        {("main" in weather)
          ? 
          <WeatherBox coords={coords} weather={weather}/>
          :
          <span/>
        }

        {("features" in attr) ? (
          <div className="attractions">
                Top places:
                {[attr.features.map(
                  (feature) =>
                      <div className="place" key={feature.id}>
                        {feature.properties.name}
                        <div className="desc">{(placeDesc[feature?.properties?.name])?.wikipedia_extracts?.text}</div>
                      </div>
                )]}

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
