import axios from 'axios';
import {config} from '../functions';
const env = config();

class MoviesService {
  public getMovie(id: number) {
    return axios.get(`${env.serverEndpoint}/movie/${id}`);
  }
  
  public getMoviesByGenre(genreId: string, pageNumber?: number) {
    let apiString = `${env.serverEndpoint}/movie/genre/${genreId}`;
    if (pageNumber && pageNumber > 0) {
      apiString += `?page=${pageNumber}`;
    }
    return axios.get(apiString);
  }
  
  public getMovies(movieIds: number[]) {
    return axios.post(`${env.serverEndpoint}/movies`, {movieIds});
  }
  
  public getMoviesByTitle(movieTitles: string[]) {
    return axios.post(`${env.serverEndpoint}/movies-by-title`, {movieTitles});
  }
  
  public getMovieRecommendations(title: string) {
    return axios.post(`${env.pythonServerEndpoint}/search`, {name: title});
  }

  public searchMovie(title: string) {
    return axios.get(`${env.serverEndpoint}/search/movie/${title}`);
  }
}

const movieService = new MoviesService();

export {movieService};