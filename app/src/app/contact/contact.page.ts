import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { ToastService } from '../services/toast.service';
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})

export class ContactPage implements OnInit {
  searchBarText:string = '';
  currentSegment: string = 'contact';
  isSearchResultFound: boolean = false;
  searchItems: Array<any> = [];
  
  constructor(
    public dataService: DataService,
    private fireStore: AngularFirestore,
    public toast: ToastService,
    private localStorage: Storage,
    private router: Router,
    public alertController: AlertController
  ) { 

  }

  ngOnInit() {
    console.log(this.dataService.currentUser);
  }

  segmentChanged() {
    this.searchItems = [];
    this.searchBarText = '';
  }

  async closeContactTip():Promise<any> {
    this.dataService.IS_SHOWING_CONTACT_TIPS = false;
    // Neven show the tips again. Users have to turn on TIPS in setting page
    this.localStorage.set('IS_SHOWING_CONTACT_TIPS', this.dataService.IS_SHOWING_CONTACT_TIPS);
  }

  getSearchText() {
    this.searchItems = [];
    this.dataService.FILTERED_CONTACT_LIST = this.dataService.currentUser.fullContactList;
    const text = this.searchBarText.toLowerCase();
    if (!text) return;

    // Filter current contact list
    if (this.currentSegment === 'contact') {
      this.dataService.FILTERED_CONTACT_LIST = this.dataService.FILTERED_CONTACT_LIST.filter(
        contact => contact.$combinedInfo.find((info:string) => info.indexOf(text) > -1)
      );
    }
    else if(this.currentSegment === 'people') {
      // Search from Firestore Database
      const query = this.fireStore.collection('users', ref => ref.where('$combinedInfo', 'array-contains', text).limit(4)).valueChanges().subscribe(res => {
        this.searchItems = [...new Set(this.searchItems.concat(res))]
          // Hide your own account record
          .filter(rec => rec.email !== this.dataService.currentUser.email) 
          // Hide the ones that are already in Contact list
          .filter(res => !this.dataService.currentUser.contacts.includes(res.email));
          query.unsubscribe();
      });
    }
  }

  getChatDocumentIdFrom2Persons(uid1:string, uid2:string):string {
    return (uid1 > uid2) ? `${uid1}${uid2}` : `${uid2}${uid1}`;
  }

  async addToContact(contact: any):Promise<any> {
    // Step 1: Add the person's email to user's contact list
    return this.fireStore.doc(`users/${this.dataService.currentUser.uid}`).update({
      contacts: firebase.firestore.FieldValue.arrayUnion(contact.email)
    })
    .then(() => {
      // Step 2: Create new document which will be use to contain the chat history (so, array type)
      // We determine the document ID by comparing 2 users' uids together. The greater string goes first
      const newDocumentId = this.getChatDocumentIdFrom2Persons(contact.uid, this.dataService.currentUser.uid);
      this.fireStore.collection('messages').doc(newDocumentId).set({}).then(() => {
        // Step 3: Feedback to user
        // Clear out search results (optional)
        this.searchItems = [];
        // Add new contact to local variables
        this.dataService.currentUser.fullContactList.push(contact);
        this.dataService.currentUser.contacts.push(contact.email);
        this.toast.presentSimpleToast('Contact added');
      });
    })
    .catch(err => {
      this.toast.presentSimpleToast(err.message);
    });
  }

  async removeFromContact(email: string):Promise<any> {
    return this.fireStore.doc(`users/${this.dataService.currentUser.uid}`).update({
      contacts: firebase.firestore.FieldValue.arrayRemove(email)
    })
    .then(() => {
      // Remove contact from local variables
      this.dataService.currentUser.fullContactList = this.dataService.currentUser.fullContactList.filter(contact => contact.email !== email);
      this.dataService.currentUser.contacts = this.dataService.currentUser.contacts.filter(_email => _email !== email);
      this.toast.presentSimpleToast('Contact removed');
    })
    .catch(err => {
      this.toast.presentSimpleToast(err.message);
    });
  }

  async deleteChatHistory(contactUid:string):Promise<any> {
    const chatDocumentId = this.getChatDocumentIdFrom2Persons(contactUid, this.dataService.currentUser.uid);
    return this.fireStore.doc(`messages/${chatDocumentId}`).delete();
  }

  async promptUserToDeleteChatHistory(event:any, contact:any) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Confirm delete',
      message: 'Aldo delete your chat history with this person?',
      buttons: [
        {
          text: 'No, keep',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.removeFromContact(contact.email);
          }
        }, {
          text: 'Yes, delete for good',
          cssClass: 'danger',
          handler: () => {
            this.deleteChatHistory(contact.uid);
            this.removeFromContact(contact.email);
          }
        }
      ]
    });

    await alert.present();
  }

  goToInbox(email: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        email: email
      }
    };
    this.router.navigate(['inbox'], navigationExtras);
  }
}
