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
  DEFAULT_AVATAR_URL: string = 'https://cdn0.iconfinder.com/data/icons/streamline-emoji-1/48/096-grinning-cat-face-256.png';

  // True if Dark mode is ON; else FALSE
  IS_DARK_MODE_ON: boolean = false;

  // If TRUE then shows tip i Contact Page
  IS_SHOWING_CONTACT_TIPS: boolean = true;

  // Used in Contact page - for filtering from searchbar
  FILTERED_CONTACT_LIST:Array<any> = [];
}
