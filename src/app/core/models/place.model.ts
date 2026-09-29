export interface Place {
  id: number;
  name: string;
  display_name: string;
  ancestor_place_ids: number[];
  bounding_box_geojson: BoundingBoxGeoJson | null;
  geometry_geojson: GeometryGeoJson | null;
  location: string;
  admin_level: number | null;
}

export interface BoundingBoxGeoJson {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface GeometryGeoJson {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
}

export interface PlaceAutocompleteResponse {
  total_results: number;
  page: number;
  per_page: number;
  results: Place[];
}
