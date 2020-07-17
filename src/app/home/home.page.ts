import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ThemeService } from '../services/theme.service';
import { Router } from '@angular/router';
import { MoviesPage } from '../movies/movies.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  darkMode = false;

  constructor(private menuCtrl: MenuController) {
  }

}
