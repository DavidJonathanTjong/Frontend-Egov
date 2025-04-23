export interface Province {
  id: string;
  name: string;
  alt_name: string;
  latitude: number;
  longitude: number;
}

export interface GeoJSONFeature {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    alt_name: string;
    hasData: boolean;
    production: number;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export interface ApiData {
  id: string;
  year: string;
  province: string;
  vegetable: string;
  production: number;
}
