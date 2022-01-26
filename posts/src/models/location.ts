import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface LocationAttrs {
  latitude: number;
  longitude: number;
  type: string;
  name: string;
  confidence: number;
  region: string;
  regionCode: string;
  county: string;
  country: string;
  countryCode: string;
  continent: string;
  label: string;
  number?: number;
  postalCode?: string;
  street?: string;
  locality?: string;
  administrativeArea?: string;
  neighbourhood?: string;
}

export interface LocationDoc extends mongoose.Document {
  latitude: number;
  longitude: number;
  type: string;
  name: string;
  confidence: number;
  region: string;
  regionCode: string;
  county: string;
  country: string;
  countryCode: string;
  continent: string;
  label: string;
  number?: number;
  postalCode?: string;
  street?: string;
  locality?: string;
  administrativeArea?: string;
  neighbourhood?: string;
}

interface LocationModel extends mongoose.Model<LocationDoc> {
  build(attrs: LocationAttrs): LocationDoc;
}

const locationSchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    regionCode: {
      type: String,
      required: true,
    },
    county: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    continent: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
    },
    postalCode: {
      type: String,
    },
    street: {
      type: String,
    },
    locality: {
      type: String,
    },
    administrativeArea: {
      type: String,
    },
    neighbourhood: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

locationSchema.set('versionKey', 'version');

locationSchema.plugin(updateIfCurrentPlugin);

locationSchema.statics.build = (attrs: LocationAttrs) => {
  return new Location(attrs);
};

const Location = mongoose.model<LocationDoc, LocationModel>(
  'Location',
  locationSchema
);

export { Location };
