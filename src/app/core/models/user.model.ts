export interface User {
  id: number;
  login: string;
  name: string | null;
  icon: string | null;
  icon_url: string | null;
  observations_count: number;
  identifications_count: number;
  journal_posts_count: number;
  activity_count: number;
  species_count: number;
  created_at: string;
  roles: string[];
  site_id: number;
}

export interface UserDetail extends User {
  description: string | null;
  updated_at: string;
  monthly_supporter: boolean;
  suspended: boolean;
}

export interface UserSearchParams {
  q?: string;
  per_page?: number;
  page?: number;
  order?: 'asc' | 'desc';
  order_by?: 'activity' | 'created' | 'login' | 'observations_count';
}

export interface UserResponse {
  total_results: number;
  page: number;
  per_page: number;
  results: User[];
}

export interface UserAutocompleteResponse {
  total_results: number;
  page: number;
  per_page: number;
  results: User[];
}
