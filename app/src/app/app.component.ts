import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router
  ) {
    this.firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        console.log('user logged in');
        this.router.navigate(['/app/chat']);
      }
      else {
        console.log('User logged out');
        
      }
    });
  }

  
}
