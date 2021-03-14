import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  isShowingPassword: boolean = false;
  isLoadingRequest = false;
  email: string = '';
  password: string = '';

  constructor(private alertController: AlertController, 
    private firebaseAuth: AngularFireAuth,
    private fireStore: AngularFirestore,
    private modalCtrl: ModalController,
    private router: Router
  ) { 
    this.clearSignUpInfo();
  }

  ngOnInit() {
    this.clearSignUpInfo();
  }

  clearSignUpInfo():void {
    this.email = '';
    this.password = '';
  }

  togglePasswordVisibility():void {
    this.isShowingPassword = !this.isShowingPassword;
  }

  async presentAlert(header:string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async sendSignUpRequestToFirebase():Promise<any> {
    this.isLoadingRequest = true;
    return this.firebaseAuth.createUserWithEmailAndPassword(this.email, this.password).then(res => {
      // Add new user data to [/users/] collection
      return this.fireStore.collection('users').doc(res.user.uid).set({
        email: res.user.email,
        displayName: res.user.displayName,
        phoneNumber: res.user.phoneNumber,
        photoURL: res.user.photoURL,
        sharedFiles: [],
        receivedFiles: [],
      })
      .then(() => {
        // Go to app
        this.router.navigate(['/app/chat']);
        this.clearSignUpInfo();
        this.isLoadingRequest = false;
      })
    })
    .catch(err => {
      this.isLoadingRequest = false;
      this.presentAlert('Error', err);
    });
  }

  dismissSignupForm() {
    this.modalCtrl.dismiss();
  }
}
