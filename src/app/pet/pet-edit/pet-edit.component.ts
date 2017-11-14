import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { Pet } from '../pet';
import { Observable } from 'rxjs/Observable';
import { PetService } from '../pet.service';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/observable/of';
import { DialogService } from '../../dialog.service';
import { UUID } from 'angular2-uuid';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Med } from '../../med';


@Component({
  selector: 'app-pet-edit',
  templateUrl: './pet-edit.component.html',
  styleUrls: ['./pet-edit.component.css']
})
export class PetEditComponent implements OnInit {
  isNewPet: boolean;
  petKey: string;
  pet$: Observable<Pet>;
  pet: Pet;
  imageUploading: boolean;
  name = new FormControl('', [Validators.required, Validators.pattern(".*\\S.*")]);

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private petService: PetService,
    private dialogService: DialogService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.petKey = this.activatedRoute.snapshot.params['id'];
    this.isNewPet = this.petKey === 'new';

    !this.isNewPet ? this.getPet() : this.pet$ = Observable.of({}) as Observable<Pet>;

    this.pet$.subscribe(pet => {
      this.pet = pet;
      this.isNewPet && (pet.imgId = UUID.UUID()); // if it is a new pet we create a uid for the img
    });

  }

  getPet() {
    this.pet$ = this.petService.getPet(this.petKey, this.authService.user.uid);
  }

  uploadImage(event: any, pet: Pet) {
    this.imageUploading = true;
    const file = event.srcElement.files[0];
    const storageRef = firebase.storage().ref(`pets/${pet.imgId}`);
    storageRef.put(file)
      .then(uploadTask => {
        pet.imageUrl = uploadTask.downloadURL;
        this.imageUploading = false;
        console.log("Success, image uploaded. URL: ", pet.imageUrl);
      });
  }

  savePet(pet: Pet) {
    const save = this.isNewPet
      ? this.petService.savePet(pet)
      : this.petService.editPet(pet, this.petKey);

    save.then(_ => this.router.navigate(['pet-list']));
  }

  removePet() {
    this.petService.removePet(this.petKey, this.pet.imgId)
      .then(_ => this.router.navigate(['pet-list']));
  }

  cancel() {
    this.isNewPet && this.pet.imageUrl && this.petService.deleteImage(this.pet.imgId) //if new pet and have imgUrl we delete it
    this.router.navigate(['pet-list']);
  }

  finished() {
    //let error = false;
    //this.medFC.forEach(formControl => {
    //  formControl.hasError('required') && (error = true);
    //})

    return this.name.hasError('required') || this.imageUploading;
  }

  addMed(pet: Pet) {
    this.petService.addMed(pet);
  }

  removeMed() {
    console.log("med");
  }

  removeDialog(selector: string) {
    let title = "";
    let dialog = "";
    let func = null;

    switch (selector) {
      case "pet":
        title = "Remove Pet";
        dialog = "Are you sure you want to remove this pet?"
        func = this.removePet;
        break;
      case "med":
        title = "Remove Medication";
        dialog = "Are you sure you want to remove this medication?"
        func = this.removeMed;
        break;
    }

    this.dialogService
      .confirm(title, dialog)
      .subscribe(res => {
        res && func.call(func); //if the res is true we remove
      });
  }

  getFormControl(medId: string) {
    return this.petService.getFormControl(medId);
  }

  getMedErrorMessage(medId: string) {
    let fc = this.petService.getFormControl(medId);
    console.log(fc);
    
    return (fc.hasError('required') || fc.hasError('pattern'))
      ? ((document.getElementById(medId).className = "no-class") && 'You must enter a valid medication name')
      : ((document.getElementById(medId).className = "container-parent") && '');
  }

  getNameErrorMessage() {
    return this.name.hasError('required') || this.name.hasError('pattern') ? 'You must enter a valid pet name' : '';
  }

  disableExtension(e: Event) {
    e.stopPropagation();
  }
}
