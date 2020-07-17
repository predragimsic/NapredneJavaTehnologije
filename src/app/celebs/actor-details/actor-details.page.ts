import { Component, OnInit } from '@angular/core';
import { Actor } from 'src/app/model/actor.model';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, ModalController } from '@ionic/angular';
import { MovieService } from 'src/app/services/movies/movie.service';
import { CelebService } from 'src/app/services/celebs/celebs.service';
import { ActorModalComponent } from '../actor-modal/actor-modal.component';
import { DatePipe } from '@angular/common';
import { UserData } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-actor-details',
  templateUrl: './actor-details.page.html',
  styleUrls: ['./actor-details.page.scss'],
})
export class ActorDetailsPage implements OnInit {
  actor: Actor;
  isLoading = false;
  birthday = '';
  user: UserData;

  constructor(private route: ActivatedRoute,
              private navCtrl: NavController,
              private celebService: CelebService,
              private loadingCtrl: LoadingController,
              private modalCtrl: ModalController,
              private datePipe: DatePipe) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('actorId')) {
        this.navCtrl.navigateBack('/celebs');
        return;
      }

      this.isLoading = true;

      this.celebService
        .getActor(parseInt(paramMap.get('actorId'), 10), this.user)
        .subscribe((actor) => {
          this.actor = actor;
          this.birthday = this.datePipe.transform(this.actor.dateOfBirth, 'mediumDate');
          this.isLoading = false;
        });
    });
  }
  onDeleteActor() {
    this.loadingCtrl.create({ message: 'Deleting...' }).then(loadingEl => {
      loadingEl.present();
      this.celebService.deleteActor(this.actor.id, this.user).subscribe(() => {
        loadingEl.dismiss();
        this.navCtrl.navigateBack('/celebs');
      });
    });
  }

  onEditActor() {
    this.modalCtrl.create({
      component: ActorModalComponent,
      componentProps: { actor: this.actor }
    }).then((modal) => {
      modal.present();
      return modal.onDidDismiss();
    }).then((resultData) => {
      if (resultData.role === 'confirm') {
        console.log(resultData);

        const actor = new Actor(
          this.actor.id,
          resultData.data.actorData.name,
          resultData.data.actorData.aka,
          resultData.data.actorData.biography,
          resultData.data.actorData.dateOfBirth,
          resultData.data.actorData.country,
          resultData.data.actorData.height,
          resultData.data.actorData.image,
          resultData.data.actorData.roles
          );

        this.celebService
          .editActor(
            actor, this.user)
          .subscribe((res) => {
            this.actor = actor;
          });
      }
    });
  }
}
