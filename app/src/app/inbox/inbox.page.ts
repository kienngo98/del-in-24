import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DataService } from '../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {

  constructor(
    private location: Location,
    public dataService: DataService,
    private fireStore: AngularFirestore
  ) {
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back()
  }

  async sendText(event:any, receiverUID:string):Promise<any> {
    event.stopPropagation();
    const text = event.target.value;
    if (!text) return;
    event.target.value = '';
    const date = new Date();
    const currentConversation = this.dataService.CONVERSATION_LIST[this.dataService.CURRENT_CONVERSATION_INDEX];
    const newChatBlock = {  
      receiverUID: receiverUID,
      senderUID: this.dataService.currentUser.uid,
      textContent: text,
      timestamp: date.getTime()
    }
    return this.fireStore.doc(`messages/${currentConversation.conversationId}`).update({
      chatHistory: firebase.firestore.FieldValue.arrayUnion(newChatBlock)
    });
  }
}
