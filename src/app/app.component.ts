import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from './dialog.service';
import { AuthService } from './auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private router: Router,
    public authService: AuthService,
    private dialogService: DialogService) {
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
}

