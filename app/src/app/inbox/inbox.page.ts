import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {
  user: any = {};

  constructor(
    private route: ActivatedRoute, 
    private location: Location,
    public dataService: DataService
  ) {
    this.route.queryParams.subscribe(params => {
      console.log('params: ', params);
      if (params && params.email) {
        const record = this.dataService.currentUser.fullContactList.find(_user => _user.email === params.email);
        if (record) {
          this.user = record;
        }
      }
    });
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back()
  }
}
