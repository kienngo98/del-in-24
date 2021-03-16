import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { ToastService } from '../services/toast.service';
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router';
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
    private router: Router
  ) { 

  }

  ngOnInit() {
    // console.log(this.dataService.currentUser);
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
    const text = this.searchBarText.toLowerCase();
    if (!text) return;

    // Filter current contact list
    if (this.currentSegment === 'contact') {

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

  async addToContact(contact: any):Promise<any> {
    return this.fireStore.doc(`users/${this.dataService.currentUser.uid}`).update({
      contacts: firebase.firestore.FieldValue.arrayUnion(contact.email)
    })
    .then(() => {
      // Clear out search results (optional)
      this.searchItems = [];
      // Add new contact to local variables
      this.dataService.currentUser.fullContactList.push(contact);
      this.dataService.currentUser.contacts.push(contact.email);
      this.toast.presentSimpleToast('Contact added');
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

  goToInbox(email: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        email: email
      }
    };
    this.router.navigate(['inbox'], navigationExtras);
  }
}
