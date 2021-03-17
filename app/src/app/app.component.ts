import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { DataService } from './services/data.service';
import { ToastService } from './services/toast.service';
import { Storage } from '@ionic/storage';

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
    private fireStore: AngularFirestore,
    private localStorage: Storage
  ) {
    // Load layout configs
    this.loadDarkModeConfig();
    this.loadContactTipConfig();

    // Load user information (if already logged in)
    this.firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        const uid = user.uid;
        this.fireStore.doc(`users/${uid}`).get().toPromise().then(res => {
          if (res.exists) {
            const userData:any = res.data();
            this.dataService.currentUser = Object.assign(this.dataService.currentUser, userData);
            this.dataService.currentUser.uid = uid;
            if (userData.contacts.length) {
              this.fireStore.collection('users', ref => ref.where('email', 'in', userData.contacts)).valueChanges().subscribe(res => {
                this.dataService.currentUser.fullContactList = res;
                this.dataService.FILTERED_CONTACT_LIST = res;
                this.getUserConversationList();
              });
            }
          }
          else {
            this.toast.presentSimpleToast('Could not find user');
          }
        });
        this.toast.presentSimpleToast('You have logged in');

        // If on home page => Navigate into the app
        // if (!this.router.url.includes('/app')) this.router.navigate(['/app/chat']);
        this.router.navigate(['/app/chat']);
      }
      else {
        // When logged out => Reset the currentUser variable
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

  async loadDarkModeConfig():Promise<any> {
    return this.localStorage.get('IS_DARK_MODE_ON').then(data => {
      this.dataService.IS_DARK_MODE_ON = data;
      document.body.classList.toggle('dark', data);
    });
  }

  async loadContactTipConfig():Promise<any> {
    return this.localStorage.get('IS_SHOWING_CONTACT_TIPS').then(data => {
      const strValue = String(data);
      if (strValue === 'true') this.dataService.IS_SHOWING_CONTACT_TIPS = true;
      else if (strValue === 'false') this.dataService.IS_SHOWING_CONTACT_TIPS = false;
    });
  }

  getUserConversationList() {
    this.fireStore.collection('messages', ref => ref.where('$combinedUIDs', 'array-contains', this.dataService.currentUser.uid)).valueChanges().subscribe(res => {
      this.dataService.CONVERSATION_LIST = res
        // Add some extra information for displaying purposes
        .map((conversation:any) => {
          conversation.$combinedUIDs.forEach((uid:string) => {
            const label = (uid === this.dataService.currentUser.uid) ? 'you' : 'other';
            conversation[label] = this.dataService.getUserContactInfoFromUID(uid);
          });

          // If the conversation has contents => Print the last text to screen
          if (!conversation.chatHistory.length) {
            conversation.showOnChatPage = false;
          }
          else {
            conversation.showOnChatPage = true;
            const lastText = conversation.chatHistory[conversation.chatHistory.length - 1];
            const lastTextSender = (lastText.senderUID === conversation.you.uid) ? 'You' : '';
            conversation.lastTextDisplay = (lastTextSender) ? `(${lastTextSender}): ${lastText.textContent}` : lastText.textContent;
          }
          return conversation;
        });
    });
  }
}
