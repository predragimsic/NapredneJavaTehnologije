import { Component, OnInit, Input } from '@angular/core';
import { Movie } from 'src/app/model/movie.model';

@Component({
  selector: 'app-movie-element',
  templateUrl: './movie-element.component.html',
  styleUrls: ['./movie-element.component.scss'],
})
export class MovieElementComponent implements OnInit {
  @Input() movie: Movie;
  constructor() { }

  ngOnInit() {}

}
