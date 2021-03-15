import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { ToastService } from '../services/toast.service';
import { UpdateInfoPage } from '../update-info/update-info.page';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    public toast: ToastService,
    public dataService: DataService,
    public modalController: ModalController,
    private localStorage: Storage
  ) { 

  }

  updateDarkMode() {
    document.body.classList.toggle('dark', this.dataService.IS_DARK_MODE_ON);
    this.localStorage.set('IS_DARK_MODE_ON', this.dataService.IS_DARK_MODE_ON);
  }

  ngOnInit() {
  }

  logout() {
    this.firebaseAuth.signOut().then(() => {
      this.toast.presentSimpleToast('You have logged out');
      this.router.navigate(['/']);
    });
  }

  async openInfoUpdatePopup() {
    const modal = await this.modalController.create({
      component: UpdateInfoPage
    });
    return await modal.present();
  }
}
