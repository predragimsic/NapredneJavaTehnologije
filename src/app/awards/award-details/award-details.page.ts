import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/model/movie.model';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Award } from 'src/app/model/award.model';
import { AwardService } from 'src/app/services/awards/awards.service';
import { AwardModalComponent } from '../award-modal/award-modal.component';
import { DatePipe } from '@angular/common';
import { UserData } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-award-details',
    templateUrl: './award-details.page.html',
    styleUrls: ['./award-details.page.scss'],
})
export class AwardDetailsPage implements OnInit {
    award: Award;
    isLoading = false;
    submitted = false;
    awardDate = '';
    user: UserData;

    constructor(private route: ActivatedRoute,
                private navCtrl: NavController,
                private awardsService: AwardService,
                private loadingCtrl: LoadingController,
                private modalCtrl: ModalController,
                private datePipe: DatePipe) {
    }

    ngOnInit() {
        this.user = JSON.parse(localStorage.getItem('currentUser'));
        this.isLoading = true;
        this.route.paramMap.subscribe((paramMap) => {
            if (!paramMap.has('awardId')) {
                this.navCtrl.navigateBack('/awards');
                return;
            }
            this.isLoading = true;

            this.awardsService
              .getAward(parseInt(paramMap.get('awardId'), 10), this.user)
              .subscribe((award) => {
                this.award = award;
                this.awardDate = this.datePipe.transform(this.award.date, 'mediumDate');
                this.isLoading = false;
              });
        });
    }
    onDeleteAward() {
        this.loadingCtrl.create({ message: 'Deleting...' }).then(loadingEl => {
            loadingEl.present();
            this.awardsService.deleteAward(this.award.id, this.user).subscribe(() => {
                loadingEl.dismiss();
                this.navCtrl.navigateBack('/awards');
            });
        });
    }

    onEditAward() {
        this.modalCtrl.create({
            component: AwardModalComponent,
            componentProps: { award: this.award }
        }).then((modal) => {
            modal.present();
            return modal.onDidDismiss();
        }).then((resultData) => {
            if (resultData.role === 'confirm') {
                console.log(resultData);

                const award = new Award(
                    this.award.id,
                    resultData.data.awardData.name,
                    resultData.data.awardData.director,
                    resultData.data.awardData.date,
                    resultData.data.awardData.country,
                    resultData.data.awardData.description,
                    resultData.data.awardData.image,
                    resultData.data.awardData.category,
                    resultData.data.awardData.actor,
                    resultData.data.awardData.movie);

                this.awardsService
                    .editAward(
                        award, this.user)
                    .subscribe((res) => {
                        this.award = award;
                    });
            }
        });
    }
}
