import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { ToastService } from '../services/toast.service';
import { UpdateInfoPage } from '../update-info/update-info.page';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  dark = false;
  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    public toast: ToastService,
    public dataService: DataService,
    public modalController: ModalController
  ) { 

  }

  updateDarkMode() {
    document.body.classList.toggle('dark', this.dark);
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
