import {
    OPENTRIP_MAP_API_KEY,
  } from '../config/keys';
  
const openTripApiInfo = {
    key: OPENTRIP_MAP_API_KEY,
    base: "https://api.opentripmap.com/0.1/en/"
}

function fetchDescription(xid){
    return fetch(`${openTripApiInfo.base}places/xid/${xid}?apikey=${openTripApiInfo.key}`);
}

function fetchPlaces(point){
    return fetch(`${openTripApiInfo.base}places/radius?radius=1000&lon=${point?.lng}&lat=${point?.lat}&apikey=${openTripApiInfo.key}`);
}

export const openTripApi = {
    fetchDescription,
    fetchPlaces
};