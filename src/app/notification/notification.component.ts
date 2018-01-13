import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  notifications$ : Observable<any[]>;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.getNotifications();
  }
  getNotifications(){
    this.notifications$ = this.notificationService.getNotifications();
  }
  deleteNotification(notKey: string){
    this.notificationService.deleteNotification(notKey);
  }
}