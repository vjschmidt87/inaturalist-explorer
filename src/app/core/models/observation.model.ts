import { Taxon } from './taxon.model';
import { User } from './user.model';
import { Photo } from './photo.model';

export interface Observation {
  id: number;
  uuid: string;
  species_guess: string;
  description: string | null;
  observed_on_string: string;
  observed_on: string;
  time_observed_at: string | null;
  created_at: string;
  updated_at: string;
  quality_grade: QualityGrade;
  license_code: string | null;
  place_guess: string | null;
  latitude: number | null;
  longitude: number | null;
  obscured: boolean;
  positional_accuracy: number | null;
  uri: string;
  community_taxon_id: number | null;
  num_identification_agreements: number;
  num_identification_disagreements: number;
  identifications_count: number;
  comments_count: number;
  faves_count: number;
  taxon: Taxon | null;
  user: User;
  photos: Photo[];
  geojson: GeoJsonPoint | null;
}

export type QualityGrade = 'research' | 'needs_id' | 'casual';

export interface GeoJsonPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface ObservationSearchParams {
  q?: string;
  taxon_id?: number;
  taxon_name?: string;
  place_id?: number;
  user_id?: number;
  user_login?: string;
  quality_grade?: QualityGrade;
  iconic_taxa?: string;
  d1?: string;
  d2?: string;
  order_by?: 'created_at' | 'observed_on' | 'species_guess' | 'votes';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
  lat?: number;
  lng?: number;
  radius?: number;
  photos?: boolean;
  geo?: boolean;
}

export interface ObservationResponse {
  total_results: number;
  page: number;
  per_page: number;
  results: Observation[];
}
