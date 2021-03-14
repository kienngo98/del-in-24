import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router
  ) { 

  }

  ngOnInit() {
  }

  logout() {
    this.firebaseAuth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }
}
