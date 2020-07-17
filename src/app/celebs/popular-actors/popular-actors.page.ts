import { Component, OnInit } from '@angular/core';
import { Actor } from 'src/app/model/actor.model';
import { Subscription } from 'rxjs';
import { CelebService } from 'src/app/services/celebs/celebs.service';
import { UserData } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-popular-actors',
  templateUrl: './popular-actors.page.html',
  styleUrls: ['./popular-actors.page.scss'],
})
export class PopularActorsPage implements OnInit {
  actors: Actor[] = [];
  private actorsSub: Subscription;
  private user: UserData;

  constructor(private celebService: CelebService) { }


  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.actorsSub = this.celebService.actors.subscribe((actors) => {
      this.actors = actors;
    });
  }

  ionViewWillEnter() {
    this.celebService.getActors(this.user).subscribe((actors) => {
      // this.movies = movies;
    });

  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    if (this.actorsSub) {
      this.actorsSub.unsubscribe();
    }
  }
}
