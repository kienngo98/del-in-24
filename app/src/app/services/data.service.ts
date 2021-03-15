import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public currentUser: any = { 
    email: '', 
    photoURL: '', 
    uid: '',
    displayName: '',
    phoneNumber: '',
    contacts: [],
    sharedFiles: [],
    receivedFiles: [],
    fullContactList: []
  };
  constructor() { }
}
