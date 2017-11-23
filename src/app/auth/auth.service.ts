import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../user'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import { ISubscription } from 'rxjs/Subscription';

@Injectable()
export class AuthService {
  user: BehaviorSubject<User> = new BehaviorSubject(null);
  user$: Observable<User>;

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase) {

    this.user$ = this.afAuth.authState.switchMap(auth => {
      if (auth) {
        /// signed in
        return this.db.object('users/' + auth.uid).valueChanges<User>();
      } else {
        /// not signed in
        return Observable.of(null);
      }
    });
    
    this.user$.subscribe(user => this.user.next(user));
  }

  login() {
    let googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({
      prompt: 'select_account'
    });

    this.afAuth.auth.signInWithPopup(googleAuthProvider)
      .then(credential => {
        this.router.navigate([`/pet-list`]);
        this.updateUser(credential.user);
      }).catch(error => console.log('auth-error', error));
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate([`/home`]);
  }

  private updateUser(authData) {
    const userData = new User(authData)

    const ref = this.db.object('users/' + authData.uid).valueChanges<User>();
    ref.take(1)
      .subscribe(user => {
        if (!user) {
          this.db.object('users/' + authData.uid).update(userData);
        }
      })
  }
}
