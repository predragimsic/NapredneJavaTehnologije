import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { ThemeService } from './services/theme.service';

export interface UserData {
  name?: string;
  surname?: string;
  email: string;
  password: string;
  id: number;
  _token: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });
  }

  onLogOut() {
    const userData: UserData =  JSON.parse(localStorage.getItem('currentUser'));
    console.log('onLogOut');
    console.log(userData);
    this.authService.logOut(userData);
  }

  toggleDarkMode() {
    this.themeService.toggleAppTheme();
  }


}
