import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // To store current user's information
  public currentUser: any = { 
    email: '', 
    photoURL: '', 
    uid: '',
    displayName: '',
    phoneNumber: '',
    contacts: [],
    sharedFiles: [],
    receivedFiles: [],
    fullContactList: [],
  };

  // Default avatar url for new account
  DEFAULT_AVATAR_URL: string = 'https://firebasestorage.googleapis.com/v0/b/del-in-24.appspot.com/o/%24default_avatar.png';

  // True if Dark mode is ON; else FALSE
  IS_DARK_MODE_ON: boolean = false;

  // If TRUE then shows tip i Contact Page
  IS_SHOWING_CONTACT_TIPS: boolean = true;


}
