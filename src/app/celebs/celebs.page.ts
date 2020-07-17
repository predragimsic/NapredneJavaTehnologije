import { Component, OnInit } from '@angular/core';
import { PopularActorsPage } from './popular-actors/popular-actors.page';
import { SearchActorsPage } from './search-actors/search-actors.page';
import { AddActorPage } from './add-actor/add-actor.page';

@Component({
  selector: 'app-celebs',
  templateUrl: './celebs.page.html',
  styleUrls: ['./celebs.page.scss'],
})
export class CelebsPage implements OnInit {
  popular = PopularActorsPage;
  search = SearchActorsPage;
  add = AddActorPage;
  constructor() { }

  ngOnInit() {
  }

}
