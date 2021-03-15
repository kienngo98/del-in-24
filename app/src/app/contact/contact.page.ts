import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { ToastService } from '../services/toast.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})

export class ContactPage implements OnInit {
  isShowingZeroContactAlert: boolean = true;
  isSearchResultFound: boolean = false;
  searchItems: Array<any> = [];
  constructor(
    public dataService: DataService,
    private fireStore: AngularFirestore,
    public toast: ToastService
  ) { 

  }

  ngOnInit() {
    console.log(this.dataService.currentUser);
  }

  getSearchText(event) {
    this.searchItems = [];

    const text = event.target.value.toLowerCase();
    if (!text) return;

    // Filter current contact list


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
}
