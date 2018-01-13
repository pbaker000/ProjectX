import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Pet } from './pet';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/catch';
import { AuthService } from '../auth/auth.service';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { Med } from '../med';
import { User } from '../user';

@Injectable()
export class PetService {
  petsRef: AngularFireList<Pet>;
  pets: Observable<Pet[]>;
  user: User;

  constructor(private db: AngularFireDatabase, private authService: AuthService) {
    authService.user.asObservable().subscribe(user => {
      if (user) //if the user doesn't exist the subscribe breaks
      {
        this.user = user;
        this.petsRef = this.db.list(`users/${user.uid}/pets`);
        this.pets = this.petsRef.snapshotChanges().map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        });
      }
    });
  }

  addMed(pet: Pet) {
    pet.meds.push(new Med(this.getMedName(pet)));
  }

  removeMed(pet: Pet, index: number) {
    pet.meds.splice(index, 1);
  }

  getMedName(pet: Pet) {
    let tempArray = pet.meds.slice();

    tempArray.sort((med1, med2) => {
      if (med1.name > med2.name) {
        return 1;
      }
      if (med1.name < med2.name) {
        return -1;
      }
      return 0;
    });

    let max = 1;
    let medName = 'Medication ' + max;

    tempArray.forEach(med => {
      if (med.name.startsWith('Medication')) {
        if (med.name == 'Medication ' + max) {
          max += 1;
          medName = 'Medication ' + max;
        }
      }
    });

    return medName;
  }

  getPet(petKey: string) {
    return this.db.object(`users/${this.user.uid}/pets/${petKey}`).valueChanges<Pet>();
  }

  getPets() {
    return this.pets;
  }

  savePet(pet: Pet) {
    return this.petsRef.push(pet)
      .then(x => console.log('Success, saved. Key: ', x.key));
  }

  editPet(pet: Pet, petKey: string) {
    return this.petsRef.update(petKey, pet)
      .then(_ => console.log('Success, updated'))
  }

  removePet(petKey: string) {
    return this.petsRef.remove(petKey)
      .then(x => console.log('Success, deleted'))
  }

  uploadImage(file: any, pet: Pet, isTemp: boolean) {
    let pathEnd;
    isTemp ? pathEnd = '-temp' : pathEnd = '';

    const storageRef = firebase.storage().ref(`pets/${pet.imgId}${pathEnd}`);
    return storageRef.put(file)
      .then(uploadTask => {
        pet.imgUrl = uploadTask.downloadURL;
        console.log('Success, image uploaded. URL: ', pet.imgUrl);
      });
  }

  deleteImage(petImgId: string, isTemp: boolean) {
    let pathEnd;
    isTemp ? pathEnd = '-temp' : pathEnd = '';

    const storageRef = firebase.storage().ref(`pets/${petImgId}${pathEnd}`);
    storageRef.delete()
      .then(_ => console.log('Success, image deleted.')).catch(error => console.log());
  }
}
