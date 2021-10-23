const weatherApi = {
  key: "14dedf519011f34668bf4ff663d2aae5",
  base: "https://api.openweathermap.org/data/2.5/"
}

function WeatherBox({coords, weather}){

    const dateBuilder = (d) => {
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
        let day = days[d.getDay()];
        let date = d.getDate();
        let month = months[d.getMonth()];
        let year = d.getFullYear();
    
        return `${day} ${date} ${month} ${year}`
    }

    return(
      <div>
        <div className="location-box">
          <div className="location"> {weather.name}, {weather.sys.country} </div>
          {/* <div className="location"> {place.hits[0].name}, {place.hits[0].country} </div> */}
          <div className="date"> {dateBuilder(new Date())} </div>
          <div className="coords"> lng: {coords.lng} lat: {coords.lat}</div>
        </div>
        
        <div className="weather-box">
          <div className="temp"> {Math.round(weather.main.temp)}°C </div>
          <div className="weather"> {weather.weather[0].main} </div>
        </div>
      </div>
    );
}

export default WeatherBox;