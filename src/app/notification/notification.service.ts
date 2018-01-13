import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MessagingService } from '../messaging.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NotificationService {

  user: any;
  messageRef: any;
  message: any;
  notifications: Observable<any[]>;

  constructor(public authService: AuthService,

    private msgService: MessagingService,
    private db: AngularFireDatabase) {

    //this.message = this.msgService.currentMessage;

    authService.user.asObservable().subscribe(user => {
      if (user) //if the user doesn't exist the subscribe breaks
      {
        this.user = user;
        this.messageRef = this.db.list(`users/${user.uid}/notifications`);
        this.notifications = this.messageRef.snapshotChanges().map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        });
      }
    });
  }

  getNotifications() {
    return this.notifications;
  }

  deleteNotification(notKey: string) {
    this.messageRef.remove(notKey)
      .then(x => console.log('Success, deleted'));
  }
}
