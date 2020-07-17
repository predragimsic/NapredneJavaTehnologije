import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Movie } from 'src/app/model/movie.model';
import { Subscription } from 'rxjs';
import { Actor } from 'src/app/model/actor.model';
import { ModalController } from '@ionic/angular';
import { CelebService } from 'src/app/services/celebs/celebs.service';
import { RoleModalComponent } from '../role-modal/role-modal.component';
import { Role } from 'src/app/model/role.model';
import { RoleID } from 'src/app/model/roleID.model';

@Component({
  selector: 'app-actor-modal',
  templateUrl: './actor-modal.component.html',
  styleUrls: ['./actor-modal.component.scss'],
})
export class ActorModalComponent implements OnInit {
  @ViewChild('f', { static: true }) form: NgForm;
  @Input() actor: Actor;
  firstname: string;
  lastname: string;
  rolesToAdd: Role[] = [];
  roles: Role[] = [];

  movies: Movie[] = [];
  private moviesSub: Subscription;

  constructor(private modalCtrl: ModalController, private celebService: CelebService) { }

  ngOnInit() {
    this.fillMovies();
    this.rolesToAdd = this.actor.roles;
    this.roles = this.actor.roles;
    const names = this.actor.name.split(' ');
    this.firstname = names[0];
    this.lastname = names[1];

  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    if (this.moviesSub) {
      this.moviesSub.unsubscribe();
    }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  fillMovies() {
    this.moviesSub = this.celebService.movies.subscribe((newMovies) => {
      this.movies = newMovies;
      this.movies.sort((a, b) => a.name.localeCompare(b.name));
    });
  }
  onEditActor() {
    if (!this.form.valid) {
      return;
    }

    this.modalCtrl.dismiss({
      actorData:
      {
        name: (this.form.value.firstname.concat(' ')).concat(this.form.value.lastname),
        aka: this.form.value.aka,
        biography: this.form.value.biography,
        dateOfBirth: this.form.value.dateOfBirth,
        country: this.form.value.country,
        height: this.form.value.height,
        image: this.form.value.image,
        roles: this.roles
      }
    }, 'confirm');

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

        if (typeof this.rolesToAdd === 'undefined'){
          this.rolesToAdd = [];
        }
        this.rolesToAdd.push(role);
        this.roles.push(role);


      }
    });
  }
  delete(role: Role) {
    console.log(role);
    const index = this.rolesToAdd.indexOf(role);
    this.rolesToAdd.splice(index, 1);
    
    for(let r of this.roles){
      if(r.roleID === role.roleID){
        r.status = 'DELETE';
      }
    }
  }
  edit(role: Role) {
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
        const index1 = this.roles.indexOf(role);
        if (index1 !== -1) {
          this.roles[index1] = roleToAdd;
        }

      }
    });
  }
}
