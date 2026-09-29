import { Photo } from './photo.model';

export interface Taxon {
  id: number;
  name: string;
  rank: TaxonRank;
  rank_level: number;
  preferred_common_name: string | null;
  iconic_taxon_name: string | null;
  iconic_taxon_id: number | null;
  is_active: boolean;
  observations_count: number;
  wikipedia_url: string | null;
  wikipedia_summary: string | null;
  default_photo: Photo | null;
  ancestor_ids: number[];
  ancestors?: Taxon[];
  children?: Taxon[];
  taxon_photos?: TaxonPhoto[];
  conservation_status?: ConservationStatus;
}

export type TaxonRank =
  | 'kingdom'
  | 'phylum'
  | 'subphylum'
  | 'class'
  | 'subclass'
  | 'order'
  | 'suborder'
  | 'family'
  | 'subfamily'
  | 'tribe'
  | 'genus'
  | 'subgenus'
  | 'species'
  | 'subspecies'
  | 'variety'
  | 'form'
  | 'hybrid';

export interface TaxonPhoto {
  taxon_id: number;
  photo: Photo;
}

export interface ConservationStatus {
  authority: string;
  status: string;
  status_name: string;
  iucn: number;
  geoprivacy: string | null;
}

export interface TaxonSearchParams {
  q?: string;
  is_active?: boolean;
  taxon_id?: number;
  rank?: TaxonRank;
  rank_level?: number;
  per_page?: number;
  page?: number;
  order?: 'asc' | 'desc';
  order_by?: 'observations_count' | 'id';
}

export interface TaxonResponse {
  total_results: number;
  page: number;
  per_page: number;
  results: Taxon[];
}

export interface TaxonAutocompleteResponse {
  total_results: number;
  page: number;
  per_page: number;
  results: Taxon[];
}
