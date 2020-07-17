import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Role } from 'src/app/model/role.model';
import { RoleModalComponent } from 'src/app/celebs/role-modal/role-modal.component';
import { CelebService } from 'src/app/services/celebs/celebs.service';
import { NgForm } from '@angular/forms';
import { Actor } from 'src/app/model/actor.model';
import { Router } from '@angular/router';
import { UserData } from 'src/app/auth/auth.service';
import { RoleID } from 'src/app/model/roleID.model';

@Component({
  selector: 'app-add-actor',
  templateUrl: './add-actor.page.html',
  styleUrls: ['./add-actor.page.scss'],
})
export class AddActorPage implements OnInit {
  @ViewChild('addForm', { static: true }) form: NgForm;

  private actorToAdd: Actor;
  private rolesToAdd: Role[] = [];
  private user: UserData;

  constructor(private modalCtrl: ModalController,
              private celebService: CelebService,
              private alertCtrl: AlertController,
              private router: Router) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  onAddRole() {
    this.modalCtrl.create({
      component: RoleModalComponent
    }).then((modal) => {
      modal.present();
      return modal.onDidDismiss();
    }).then((resultData) => {
      if (resultData.role === 'confirm') {
        console.log(resultData);

        const role = new Role(
          new RoleID(-1, -1),
          resultData.data.roleData.name,
          resultData.data.roleData.image,
          resultData.data.roleData.content,
          'INSERT'
        );

        this.rolesToAdd.push(role);

      }
    });
  }
  onAddActor(form: NgForm) {
    if (form.valid) {
      const fullname = form.value.firstName.concat(' ', form.value.lastName);

      this.actorToAdd = new Actor(-1,
                                  fullname,
                                  form.value.aka,
                                  form.value.biography,
                                  form.value.dateOfBirth,
                                  form.value.country,
                                  form.value.height,
                                  form.value.image,
                                  this.rolesToAdd);

      this.celebService
        .addActor(this.actorToAdd, this.user)
        .subscribe(actors => {
          actors.map((ac) => {
            if (ac.name === form.name) {
              this.openSavedAlert('$event');
            }
          });
        });
    }
  }
  openAlert(form: NgForm, event) {

    event.stopPropagation();
    event.preventDefault();

    this.alertCtrl.create({
      header: 'Saving actor',
      message: 'Are you sure you want to save this actor?',
      buttons: [
        {
          text: 'Save',
          handler: () => {
            this.onAddActor(form);
            this.openSavedAlert(event);
            form.reset();
            this.rolesToAdd = [];
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Did not save it!');
          }
        }
      ]
    }).then((alert) => {
      alert.present();
    });
  }
  openSavedAlert(event) {

    event.stopPropagation();
    event.preventDefault();

    this.alertCtrl.create({
      header: 'Succesfully saved',
      message: 'Your actor was successfully saved!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
          }
        }
      ]
    }).then((alert) => {
      alert.present();
    });
  }
  delete(role: Role){
    console.log(role);
    const index = this.rolesToAdd.indexOf(role);
    this.rolesToAdd.splice(index, 1);
  }
  edit(role: Role){
    console.log(role);
    this.modalCtrl.create({
      component: RoleModalComponent,
      componentProps: { name: role.name, image: role.image, content: role.content }
    }).then((modal) => {
      modal.present();
      return modal.onDidDismiss();
    }).then((resultData) => {
      if (resultData.role === 'confirm') {
        console.log(resultData);

        const roleToAdd = new Role(
          role.roleID,
          resultData.data.roleData.name,
          resultData.data.roleData.image,
          resultData.data.roleData.content,
          'UPDATE'
        );

        const index = this.rolesToAdd.indexOf(role);
        if (index !== -1) {
          this.rolesToAdd[index] = roleToAdd;
      }

      }
    });
  }
}
