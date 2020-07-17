import { Pipe, PipeTransform } from '@angular/core';
import { Movie } from '../model/movie.model';

@Pipe({
  name: 'genrePipe'
})
export class GenrePipePipe implements PipeTransform {
  transform(items: Movie[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => {
      return item.genre.name.localeCompare(filter) === 0;
    });
  }
}
