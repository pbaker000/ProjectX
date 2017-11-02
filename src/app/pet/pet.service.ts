import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Pet } from './pet';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/catch';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class PetService {
  petsRef: AngularFireList<Pet>;
  pets: Observable<Pet[]>;
  userUid: string;

  constructor(private db: AngularFireDatabase, private authService: AuthService) {
    authService.user$.subscribe(user => {
      this.userUid = user.uid;

      this.petsRef = this.db.list(`${user.uid}/pets`);
      this.pets = this.petsRef.snapshotChanges().map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
    });

  }

  getPet(petKey: string) {
    return this.db.object(`${this.userUid}/pets/${petKey}`).valueChanges()
      .catch(this.errorHandler);
  }

  getPets() {
    return this.pets.catch(this.errorHandler);
  }

  savePet(pet: Pet) {

    return this.petsRef.push(pet)
      .then(x => {
        console.log('Success, saved. Key: ', x.key);
      });
    //.catch(error => console.log(error));
  }

  editPet(pet: Pet, petKey: string) {
    return this.petsRef.update(petKey, pet)
      .then(_ => console.log('Success, updated'))
      .catch(error => console.log(error));
  }
  removePet(petKey: string, petImgId: string) {

    this.deleteImage(petImgId);

    return this.petsRef.remove(petKey)
      .then(x => console.log('Success, deleted'))
      .catch(error => console.log(error));
  }

  deleteImage(petImgId: string) {
    const storageRef = firebase.storage().ref(`${this.userUid}/pets/${petImgId}`);
    storageRef.delete()
      .then(_ => console.log("Success, image deleted."));
  }

  private errorHandler(error) {
    console.log(error);
    return Observable.throw(error);
  }
}
