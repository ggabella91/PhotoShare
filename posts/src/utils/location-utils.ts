import { LocationType } from '../models/location';

interface LocationReq {
  latitude: number;
  longitude: number;
  type: string;
  name: string;
  number: number | null;
  postal_code: string | null;
  street: string | null;
  confidence: number;
  region: string;
  region_code: string;
  county: string;
  locality: string | null;
  administrative_area: string | null;
  neighbourhood: string | null;
  country: string;
  country_code: string;
  continent: string;
  label: string;
}

export const createLocationObject = (location: LocationReq) => {
  let locationObj: LocationType = {
    latitude: location.latitude || -1,
    longitude: location.longitude || -1,
    type: location.type || '',
    name: location.name || '',
    number: location.number || -1,
    postalCode: location.postal_code || '',
    street: location.street || '',
    confidence: location.confidence || -1,
    region: location.region || '',
    regionCode: location.region_code || '',
    county: location.county || '',
    locality: location.locality || '',
    administrativeArea: location.administrative_area || '',
    neighbourhood: location.neighbourhood || '',
    country: location.country || '',
    countryCode: location.country_code || '',
    continent: location.continent || '',
    label: location.label || '',
  };

  return locationObj;
};
