import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';

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
  ) { 

  }

  ngOnInit() {
    console.log(this.dataService.currentUser);
  }

  getSearchText(event) {
    this.searchItems = [];
    const text = event.target.value;
    if (!text) return;
    if (Number(text)) {
      const phoneNumberQuery = this.fireStore.collection('users', ref => ref.where('phoneNumber', '==', text)).valueChanges().subscribe(res => {
        this.searchItems = [...new Set(this.searchItems.concat(res))];
        phoneNumberQuery.unsubscribe();
      });;
    }
    else {
      const emailQuery = this.fireStore.collection('users', ref => ref.where('email', '==', text)).valueChanges().subscribe(res => {
        this.searchItems = [...new Set(this.searchItems.concat(res))];
        emailQuery.unsubscribe();
      });
    }
  }
}
