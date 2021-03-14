import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
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
    public dataService: DataService
  ) {
    this.firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        this.dataService.currentUser = {
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
          displayName: user.displayName,
          phoneNumber: user.phoneNumber
        }
        this.toast.presentSimpleToast('You have logged in');
        if (!this.router.url.includes('/app')) this.router.navigate(['/app/chat']);
      }
      else {
        this.dataService.currentUser = { email: '' };
      }
    });
  }

  
}
