import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavigationExtras, Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  constructor(
    private fireStore: AngularFirestore,
    private router: Router,
    public toast: ToastService,
    public dataService: DataService
  ) { }

  ngOnInit() {
  }

  goToInbox(email: string) {
    this.dataService.getCurrentConversationIndex(email);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        email: email
      }
    };
    this.router.navigate(['inbox'], navigationExtras);
  }
}
