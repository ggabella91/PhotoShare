import mongoose from 'mongoose';

type ConstructorMapping<T> = T extends NumberConstructor
  ? number
  : T extends StringConstructor
  ? string
  : never;

const locationSchemaObjRequired = {
  latitude: Number,
  longitude: Number,
  type: String,
  name: String,
  confidence: Number,
  region: String,
  regionCode: String,
  county: String,
  country: String,
  countryCode: String,
  continent: String,
  label: String,
};

const locationSchemaObjOptional = {
  number: Number,
  postalCode: String,
  street: String,
  locality: String,
  administrativeArea: String,
  neighbourhood: String,
};

const locationSchema = {
  ...locationSchemaObjRequired,
  ...locationSchemaObjOptional,
};

export const LocationSchema = new mongoose.Schema(locationSchema);

type LocationSchemaObjRequired = typeof locationSchemaObjRequired;
type LocationSchemaObjOptional = typeof locationSchemaObjOptional;

type LocationTypeRequired = {
  [prop in keyof LocationSchemaObjRequired]: ConstructorMapping<
    LocationSchemaObjRequired[prop]
  >;
};

type LocationTypeOptional = {
  [prop in keyof LocationSchemaObjOptional]?: ConstructorMapping<
    LocationSchemaObjOptional[prop]
  >;
};

export type LocationType = LocationTypeRequired & LocationTypeOptional;
