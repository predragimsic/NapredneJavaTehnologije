import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private authService: AuthService, private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  onRegister(form: NgForm) {
    if (form.valid) {
      console.log(form.value);
      this.authService.register(form.value).subscribe(resData => {
        console.log('registrated!');
        console.log(resData);
        this.router.navigateByUrl('/login');
      },
        errRes => {
          console.log(errRes);
          const message = 'Incorrect data put!';

          this.alertCtrl.create(
            {
              header: 'Registration failed',
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
