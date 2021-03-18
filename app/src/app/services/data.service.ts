import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private localStorage: Storage) {

  }

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

  // Tells when user data is loaded
  ALL_USER_DATA_LOADED:boolean = false;

  // Default avatar url for new account
  DEFAULT_AVATAR_URL: string = 'https://cdn0.iconfinder.com/data/icons/streamline-emoji-1/48/096-grinning-cat-face-256.png';

  // True if Dark mode is ON; else FALSE
  IS_DARK_MODE_ON: boolean = false;

  // If TRUE then shows tip i Contact Page
  IS_SHOWING_CONTACT_TIPS: boolean = true;

  // Used in Contact page - for filtering from searchbar
  FILTERED_CONTACT_LIST:Array<any> = [];

  // Use to list all the conversations user has on Chat page
  CONVERSATION_LIST: Array<any> = [];

  // Use to determine the current inbox user's viewing
  CURRENT_CONVERSATION_INDEX:number = null;

  public getUserContactInfoFromUID(uid:string) {
    const currentUser = {...this.currentUser};
    delete currentUser.fullContactList;
    const searchArray = this.currentUser.fullContactList.concat([currentUser]);
    return searchArray.find(contact => contact.uid === uid);
  }

  public getChatDocumentIdFrom2Persons(uid1:string, uid2:string):string {
    return (uid1 > uid2) ? `${uid1}${uid2}` : `${uid2}${uid1}`;
  }

  public getCurrentConversationIndex(email:string) {
    const otherUserUID = this.currentUser.fullContactList.find(user => user.email === email).uid;
    const documentUID = this.getChatDocumentIdFrom2Persons(otherUserUID, this.currentUser.uid);
    this.CURRENT_CONVERSATION_INDEX = this.CONVERSATION_LIST.findIndex(convo => convo.conversationId === documentUID);
    this.localStorage.set('CURRENT_CONVERSATION_INDEX', this.CURRENT_CONVERSATION_INDEX);
  }
}
