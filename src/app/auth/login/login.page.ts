import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authService: AuthService, private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {
  }
  onLogIn(form: NgForm) {
    console.log(form);
    if (form.valid) {
      this.authService.logIn(form.value).subscribe((resData) => {
        console.log('logged in!');
        console.log(resData);
        this.router.navigateByUrl('/home');
        form.reset();
      },
        errRes => {
          console.log(errRes);
          const message = 'Incorrect email or password';

          this.alertCtrl.create(
            {
              header: 'Authentication failed',
              message,
              buttons: ['Okay']
            }
          ).then((alert) => {
            alert.present();
          });

          form.reset();
        });
    }
  }
}
