import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  isShowingZeroContactAlert: boolean = true;
  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
    console.log(this.dataService.currentUser)
  }

}
