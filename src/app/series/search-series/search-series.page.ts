import { Component, OnInit, Input } from '@angular/core';
import { SeriesService } from 'src/app/services/series/series.service';
import { Series } from 'src/app/model/series.model';
import { Subscription } from 'rxjs';
import { UserData } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-search-series',
  templateUrl: './search-series.page.html',
  styleUrls: ['./search-series.page.scss'],
})
export class SearchSeriesPage implements OnInit {
  searchText = '';
  series: Series[] = [];
  private seriesSub: Subscription;
  user : UserData;

  constructor(private seriesService: SeriesService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.seriesSub = this.seriesService.series.subscribe((series) => {
      this.series = series;
    });
  }


  ionViewWillEnter() {
    this.seriesService.getSeries(this.user).subscribe((series) => {
      // this.movies = movies;
    });

  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    if (this.seriesSub) {
        this.seriesSub.unsubscribe();
    }
}


}
