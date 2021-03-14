import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

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

  constructor(
    private firebaseAuth: AngularFireAuth,
    private fireStore: AngularFirestore,
    private modalCtrl: ModalController,
    private router: Router,
    public toast: ToastService
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

  async sendSignUpRequestToFirebase():Promise<any> {
    this.isLoadingRequest = true;
    return this.firebaseAuth.createUserWithEmailAndPassword(this.email, this.password).then(res => {
      // Add new user data to [/users/] collection
      return this.fireStore.collection('users').doc(res.user.uid).set({
        email: res.user.email,
        // displayName: res.user.displayName,
        // phoneNumber: res.user.phoneNumber,
        // photoURL: res.user.photoURL,
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
      this.toast.presentSimpleToast(err);
    });
  }

  dismissSignupForm() {
    this.modalCtrl.dismiss();
  }
}
