import { Pipe, PipeTransform } from '@angular/core';
import { Actor } from '../model/actor.model';

@Pipe({
  name: 'actorFilter'
})
export class FilterPipe implements PipeTransform {

  transform(items: Actor[], searchText: string): any[] {
    if (!items || !searchText) {
      return [];
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(it => {
      return (it.name.toLocaleLowerCase().includes(searchText) || it.aka.toLocaleLowerCase().includes(searchText));
    });
  }

}
