
export interface movieResponse {
    page?: number,
    results: [movieList],
    total_pages: number,
    total_results: number
}

export interface movieList {
    adult?: boolean,
    backdrop_path?: [number],
    id?: number,
    original_language?: string,
      original_title?: string,
      overview?: string,
      popularity?: number,
      poster_path?: string,
      release_date?: string,
      title?: string,
      video?: boolean,
      vote_average?: number,
      vote_count?: number
}