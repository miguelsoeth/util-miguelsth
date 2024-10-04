import { Component, OnInit, inject } from '@angular/core';
import { HeaderService } from '../../../services/header.service';
import { MovieService } from '../../../services/movie.service';
import { GraphService } from '../../../services/graph.service';
import { Movie } from '../../../interfaces/movie';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-network-degree',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './network-degree.component.html',
  styleUrl: './network-degree.component.css'
})
export class NetworkDegreeComponent implements OnInit {
  header = inject(HeaderService);
  movie = inject(MovieService);
  graph = inject(GraphService);

  uniqueActors: string[] = [];
  movies: Movie[] = [];

  originActor!: string;
  destinyActor!: string;
  result?: string[];

  ngOnInit(): void {
    this.header.setTitle("Network degree");
    this.getMovieInfos();
  }

  getMovieInfos() {
    this.movie.getMovies().subscribe(data => {
      console.log("FILMES: ", data);
      this.movies = data;
      this.uniqueActors = this.movie.getUniqueActors(this.movies);

      this.getGraph(this.movies);
    });
  }

  getGraph(movies: Movie[]) {
    movies.forEach(movie => {
      this.graph.adicionarVertice(movie.title);

      movie.cast.forEach(actor => {
        this.graph.adicionarVertice(actor);
        this.graph.adicionarAresta(movie.title, actor);
      });
    });
  }

  calculateNetworkDegree() {
    this.result = this.graph.encontrarRelacionamentoMaisProximo(this.originActor, this.destinyActor);

    console.log(this.result);

  }

}
