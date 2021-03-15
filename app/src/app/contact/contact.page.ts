import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import type firebase from 'firebase';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})

export class ContactPage implements OnInit {
  isShowingZeroContactAlert: boolean = true;
  isSearchResultFound: boolean = false;

  searchItems: Observable<any>;
  emailFilter: BehaviorSubject<string|null> = new BehaviorSubject(null);
  displayNameFilter: BehaviorSubject<string|null> = new BehaviorSubject(null);
  phoneNumberFilter: BehaviorSubject<string|null> = new BehaviorSubject(null);

  constructor(
    public dataService: DataService,
    private fireStore: AngularFirestore,
  ) { 
    this.searchItems = combineLatest([
      this.emailFilter,
      this.displayNameFilter,
      this.phoneNumberFilter]
    ).pipe(
      switchMap(([email, displayName, phoneNumber]) => 
        this.fireStore.collection('items', ref => {
          let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
          if (email) { query = query.where('email', '==', email) };
          if (displayName) { query = query.where('displayName', '==', displayName) };
          if (phoneNumber) { query = query.where('phoneNumber', '==', phoneNumber) };
          return query;
        }).valueChanges()
      )
    );
  }

  ngOnInit() {
    console.log(this.dataService.currentUser);
    console.log(this.searchItems);
  }

  getSearchText(event) {
    const text = event.target.value;
    if (!text) return;
    this.filterByDisplayName(text);
    if (Number(text)) {
      this.filterByPhoneNumber(text);
    }
    else {
      this.filterByEmail(text);
    }
  }

  filterByEmail(email: string|null) {
    this.emailFilter.next(email); 
  }

  filterByDisplayName(name: string|null) {
    this.displayNameFilter.next(name); 
  }

  filterByPhoneNumber(_number: string|null) {
    this.phoneNumberFilter.next(_number);
  }
}
