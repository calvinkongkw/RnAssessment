/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/Services.md)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type { ApiConfig, ApiFeedResponse } from "./api.types"
import type { EpisodeSnapshotIn } from "../../models/Episode"
import { movieList, movieResponse } from "./movieDashboard/movieDashboard.type"

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiODRkMzkzYWNmYTZhMWRhNGRjOTNhOTI3YjgxZjc4ZiIsInN1YiI6IjY1ZWU2MmQxYjMzMTZiMDE4NjIwNDU2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.znpdraIkZuQY6FXKwNJMjJr4xxbsP-C7nr5oEelguFs",
      },
    })
  }

  async fetchMovies(url: string): Promise<{ kind: string; movies: any[] } | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get(url)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData = response.data
      const movies = rawData?.results?.map((raw: any) => ({ ...raw })) ?? []

      return { kind: "ok", movies }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async getSearchMovieList(
    query: string,
  ): Promise<{ kind: string; movies: any[] } | GeneralApiProblem> {
    const url = `search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    return this.fetchMovies(url)
  }

  async getMovieList(page: number): Promise<{ kind: string; movies: any[] } | GeneralApiProblem> {
    const url = `discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`
    return this.fetchMovies(url)
  }
}

export const api = new Api()
