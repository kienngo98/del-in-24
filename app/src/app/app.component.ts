import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { DataService } from './services/data.service';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    public toast: ToastService,
    public dataService: DataService,
    private fireStore: AngularFirestore
  ) {
    this.firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        const uid = user.uid;
        this.fireStore.doc(`users/${uid}`).get().toPromise().then(res => {
          if (res.exists) {
            this.dataService.currentUser = Object.assign(this.dataService.currentUser, res.data());
            this.dataService.currentUser.uid = uid;
          }
          else {
            this.toast.presentSimpleToast('Could not find user');
          }
        });
        this.toast.presentSimpleToast('You have logged in');

        // If on home page => Navigate into the app
        if (!this.router.url.includes('/app')) this.router.navigate(['/app/chat']);
      }
      else {
        this.dataService.currentUser = { 
          email: '', 
          photoURL: '', 
          uid: '',
          displayName: '',
          phoneNumber: '',
          contacts: [],
          sharedFiles: [],
          receivedFiles: []
        };
      }
    });
  }
}
