import { Location, LocationAttrs } from '../models/location';

export interface LocationReq {
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
  let locationObj: LocationAttrs = {
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

export const saveNewOrGetExistingLocation = async (location: LocationAttrs) => {
  const existingLocation = await Location.findOne({
    latitude: location.latitude,
    longitude: location.longitude,
  });

  if (existingLocation) {
    console.log('Found existing location: ', existingLocation);
    return existingLocation;
  } else {
    const newLocation = Location.build({ ...location });

    try {
      await newLocation.save();

      console.log('Saved new location: ', newLocation);
      return newLocation;
    } catch (err) {
      console.log('Error saving location: ', err);

      return null;
    }
  }
};
