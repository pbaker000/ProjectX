import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from './dialog.service';
import { AuthService } from './auth/auth.service';
import { MessagingService } from './messaging.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { NotificationService } from './notification/notification.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';
  message: any;
  user: any;

  constructor(private router: Router,
    public authService: AuthService,
    private dialogService: DialogService,
    public notiService: NotificationService,
    private msgService: MessagingService) {
  }

  ngOnInit() {
    this.msgService.getPermission();
    this.msgService.receiveMessage();
    this.message = this.msgService.currentMessage;
    this.message.subscribe(message => {
      if (message) {
        this.alertDialog(message);
      }
    });
  }

  onClick(): void {
    this.router.navigate(['/home'])
  }

  logoutDialog() {
    this.dialogService
      .confirm('Logout', 'Are you sure you want to logout?')
      .subscribe(res => {
        if (res) {
          this.authService.logout();
        }
      });
  }

  alertDialog(payload: any) {
    this.dialogService
      .alert(payload.notification.title, payload.notification.body)
      .subscribe(res => {
        if (res) {
          this.notiService.deleteNotification(payload.key);
        }
      });
  }
}

