import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { SignupPage } from '../signup/signup.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  async openSignUpModal() {
    const modal = await this.modalController.create({
      component: SignupPage
    });
    return await modal.present();
  }

  async openLogInModal() {
    const modal = await this.modalController.create({
      component: LoginPage
    });
    return await modal.present();
  }
}
