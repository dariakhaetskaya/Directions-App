import {
    GRAPH_HOPPER_API_KEY,
  } from '../config/keys';

const geotagApiInfo = {
    key: GRAPH_HOPPER_API_KEY,
    base: "https://graphhopper.com/api/1/"
  }

  function fetchCoordinates(query){
    return fetch(`${geotagApiInfo.base}geocode?q=${query}&locale=en&key=${geotagApiInfo.key}`);
  }
  
  export const geotagApi = {
    fetchCoordinates,
  };