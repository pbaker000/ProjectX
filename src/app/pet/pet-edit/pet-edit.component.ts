import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import * as firebase from 'firebase/app';
import { Pet } from '../pet';
import { Observable } from 'rxjs/Observable';
import { PetService } from '../pet.service';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/observable/of';
import { DialogService } from '../../dialog.service';
import { UUID } from 'angular2-uuid';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Med } from '../../med';
import { ISubscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-pet-edit',
  templateUrl: './pet-edit.component.html',
  styleUrls: ['./pet-edit.component.css']
})
export class PetEditComponent implements OnInit, OnDestroy, AfterViewChecked {
  isNewPet: boolean;
  petKey: string;
  pet$: Observable<Pet>;
  pet: Pet;
  imageUploading: boolean;
  myForm = new FormGroup({
    'name': new FormControl('', [Validators.required, Validators.pattern(".*\\S.*"), Validators.maxLength(20)]),
    'medications': new FormArray([]),
  });
  petSub: ISubscription;


  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private petService: PetService,
    private dialogService: DialogService,
    private authService: AuthService,
    private changeDetectionRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.petKey = this.activatedRoute.snapshot.params['id'];
    this.isNewPet = this.petKey === 'new';

    !this.isNewPet ? this.getPet() : this.pet$ = Observable.of({}) as Observable<Pet>;

    this.petSub = this.pet$.subscribe(pet => {
      this.pet = pet;
      this.petInit(pet);
    });

  }

  ngAfterViewChecked(): void {
    this.changeDetectionRef.detectChanges(); // manually call detect changes in order to fix Expression Changed Error
  }

  petInit(pet: Pet) {    
    this.isNewPet && (pet.imgId = UUID.UUID()); // if it is a new pet we create a uid for the img
    pet && pet.meds && pet.meds.forEach(med => this.addMedFC());
  }

  getPet() {
    this.pet$ = this.petService.getPet(this.petKey);
  }

  getNameErrorMessage() {
    return this.myForm.get('name').invalid ? 'You must enter a valid pet name' : '';
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

  addMed(pet: Pet) {
    !pet.meds && (pet.meds = []);
    this.addMedFC();
    this.petService.addMed(pet);
  }

  removeMed(pet: Pet, index: number) {
    this.dialogService.confirm("Remove Medication", "Are you sure you want to remove this medication?")
      .subscribe(res => {
        if (res) {
          this.petService.removeMed(pet, index);
          (<FormArray>this.myForm.get('medications')).removeAt(index);
        }
      });
  }

  getMedErrorMessage(index: string) {
    return (<FormArray>this.myForm.get('medications')).get(index.toString()).invalid
      ? ((document.getElementById(index).className = "none") && 'You must enter a valid medication name')
      : ((document.getElementById(index).className = "container-parent") && '');
  }

  addMedFC() {
    (<FormArray>this.myForm.get('medications')) //add a new control form
      .push(new FormControl('', [Validators.required, Validators.pattern(".*\\S.*"), Validators.maxLength(25)]));
  }

  savePet(pet: Pet) {
    const save = this.isNewPet
      ? this.petService.savePet(pet)
      : this.petService.editPet(pet, this.petKey);

    save.then(_ => this.router.navigate(['pet-list']));
  }

  removePet() {
    this.dialogService.confirm("Remove Pet", "Are you sure you want to remove this pet?").subscribe(res => {
      res && this.petService.removePet(this.petKey, this.pet.imgId, this.pet.imageUrl) // if result is true then remove pet
        .then(_ => this.router.navigate(['pet-list']));
    });
  }

  cancel() {
    this.isNewPet && this.pet.imageUrl && this.petService.deleteImage(this.pet.imgId) //if new pet and have imgUrl we delete it
    this.router.navigate(['pet-list']);
  }

  finished() {
    return this.myForm.invalid || this.imageUploading;
  }

  getPlaceholder()
  {
    return this.isNewPet ? "always" : "never"; 
  }

  disableExtension(e: Event) {
    e.stopPropagation();
  }

  ngOnDestroy() {
    this.petSub.unsubscribe();
  }
}
