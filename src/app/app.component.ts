import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private router: Router, private db: AngularFireDatabase)
  {
    this.db.object('connected').valueChanges().subscribe(console.log);
  }
  onClick(): void
  {
    this.router.navigate(['/home'])
  }
  
}

