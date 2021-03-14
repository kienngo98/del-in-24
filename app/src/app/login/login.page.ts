import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isShowingPassword: boolean = false;
  isLoadingRequest = false;
  email: string = '';
  password: string = '';

  constructor(private alertController: AlertController, 
    private firebaseAuth: AngularFireAuth,
    private modalCtrl: ModalController,
    private router: Router) { 
      this.clearLogInInfo();
  }

  ngOnInit() {
    this.clearLogInInfo();
  }

  clearLogInInfo() {
    this.email = '';
    this.password = '';
  }

  async presentAlert(header:string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
 
  dismissLogInForm() {
    this.modalCtrl.dismiss();
  }

  async sendLogInRequestToFirebase():Promise<any> {
    return this.firebaseAuth.signInWithEmailAndPassword(this.email, this.password).then(res => {
      console.log(res.user);

      // Close log in modal when logged in
      this.dismissLogInForm();
      // Go to app
      this.router.navigate(['/app/chat']);
    })
    .catch(err => {
      console.log(err);
    });
  }
}
