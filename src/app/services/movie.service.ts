import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from '../interfaces/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private jsonFilePath = 'assets/jsons/latest_movies_reduced.json';

  constructor(private http: HttpClient) { }

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.jsonFilePath);
  }

  getUniqueActors(movies: Movie[]): string[] {
    const uniqueActors = new Set<string>();

    movies.forEach(movie => {
      movie.cast.forEach(actor => {
        uniqueActors.add(actor);
      });
    });

    return Array.from(uniqueActors);
  }
}
