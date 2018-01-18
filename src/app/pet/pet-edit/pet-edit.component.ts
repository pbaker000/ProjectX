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
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';


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
  imgUploading: boolean;
  prevImg: any;
  unchangedTD: any[] = [];
  options: string[] = [];
  notifications: any[][] = [];
  periods = [
    { value: "am-0", viewValue: "am" },
    { value: "pm-1", viewValue: "pm" }
  ]

  doWTypes = [
    { value: "sunday-0", viewValue: "Sunday" },
    { value: "monday-1", viewValue: "Monday" },
    { value: "tuesday-2", viewValue: "Tuesday" },
    { value: "wednesday-3", viewValue: "Wednesday" },
    { value: "thursday-4", viewValue: "Thursday" },
    { value: "friday-5", viewValue: "Friday" },
    { value: "saturday-6", viewValue: "Saturday" }
  ]

  doMTypes = [
    { value: "1-0", viewValue: "1st" },
    { value: "2-1", viewValue: "2nd" },
    { value: "3-2", viewValue: "3rd" },
    { value: "4-3", viewValue: "5th" },
    { value: "5-4", viewValue: "6th" },
    { value: "6-5", viewValue: "7th" },
    { value: "7-6", viewValue: "8th" },
    { value: "8-7", viewValue: "9th" },
    { value: "9-8", viewValue: "10th" },
    { value: "10-9", viewValue: "11th" },
    { value: "11-10", viewValue: "12th" },
    { value: "12-11", viewValue: "13th" },
    { value: "13-12", viewValue: "14th" },
    { value: "14-13", viewValue: "15th" },
    { value: "15-14", viewValue: "16th" },
    { value: "16-15", viewValue: "17th" },
    { value: "17-16", viewValue: "18th" },
    { value: "18-17", viewValue: "19th" },
    { value: "19-18", viewValue: "20th" },
    { value: "20-19", viewValue: "21st" },
    { value: "21-20", viewValue: "22nd" },
    { value: "22-21", viewValue: "23rd" },
    { value: "23-22", viewValue: "24th" },
    { value: "24-23", viewValue: "25th" },
    { value: "25-24", viewValue: "26th" },
    { value: "26-25", viewValue: "27th" },
    { value: "27-26", viewValue: "28th" },
    { value: "28-27", viewValue: "29th" },
    { value: "29-28", viewValue: "30th" },
    { value: "30-29", viewValue: "31st" },
  ]

  filteredOptions: Observable<string[]>[] = [];
  myForm = new FormGroup({
    'name': new FormControl('', [Validators.required, Validators.pattern('.*\\S.*'), Validators.maxLength(20)]),
    'age': new FormControl(),
    'info': new FormControl(),
    'medications': new FormArray([])
  });
  petSub: ISubscription;

  doseTypes = [];

  durTypes = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private petService: PetService, private dialogService: DialogService,
    private authService: AuthService, private changeDetectionRef: ChangeDetectorRef, private db: AngularFireDatabase) {

  }

  ngOnInit() {
    this.petKey = this.activatedRoute.snapshot.params['id'];
    this.isNewPet = this.petKey === 'new';

    !this.isNewPet ? this.getPet() : this.pet$ = Observable.of(new Pet()) as Observable<Pet>;

    this.db.list(`admin/data`).valueChanges<string[]>()
      .subscribe(data => {
        this.options = data[0];
        this.doseTypes = data[1];
        this.durTypes = data[2];
      });

    this.petSub = this.pet$.subscribe((pet: Pet) => {
      this.pet = pet;
      this.isNewPet && (pet.imgId = UUID.UUID()); // if it is a new pet we create a uid for the img
      pet && pet.meds && pet.meds.forEach((med, i) => {
        this.unchangedTD[i] = med.totalDoses;

        this.addMedFC();
        let startDT = new Date(med.startDateTime);

        this.notifications[i] = [];
        this.notifications[i][0] = (startDT.getHours() > 12) ? startDT.getHours() - 12 : startDT.getHours();
        this.notifications[i][1] = startDT.getMinutes();
        this.notifications[i][2] = (startDT.getHours() > 12) ? "pm-1" : "am-0";
      });
    });
  }

  ngAfterViewChecked(): void {
    this.changeDetectionRef.detectChanges(); // manually call detect changes in order to fix Expression Changed Error
  }

  filter(val: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }


  getPet() {
    this.pet$ = this.petService.getPet(this.petKey);
  }

  getNameErrorMessage() {
    return this.myForm.get('name').invalid ? 'You must enter a valid pet name' : '';
  }

  prevImgUpload(event: any, pet: Pet) {
    let file = event.srcElement.files[0];
    if (file) {
      this.prevImg = file;

      this.imgUploading = true;
      this.petService.uploadImage(this.prevImg, pet, true)
        .then(_ => this.imgUploading = false);
    }
  }

  addMed(pet: Pet) {
    !pet.meds && (pet.meds = []);
    this.addMedFC();
    this.petService.addMed(pet);

    let now = new Date();
    this.notifications[pet.meds.length - 1] = [];
    this.notifications[pet.meds.length - 1][0] = (now.getHours() > 12) ? now.getHours() - 12 : now.getHours();
    this.notifications[pet.meds.length - 1][1] = now.getMinutes();
    this.notifications[pet.meds.length - 1][2] = (now.getHours() > 12) ? "pm-1" : "am-0";
  }

  removeMed(pet: Pet, index: number) {
    this.dialogService.confirm('Remove Medication', 'Are you sure you want to remove this medication?')
      .subscribe(res => {
        if (res) {
          this.petService.removeMed(pet, index);
          (<FormArray>this.myForm.get('medications')).removeAt(index);
        }
      });
  }

  getMedErrorMessage(index: string) {
    return (<FormArray>this.myForm.get('medications')).get(index.toString()).invalid
      ? ((document.getElementById(index).className = 'none') && 'You must enter a valid medication name')
      : ((document.getElementById(index).className = 'container-parent') && '');
  }

  addMedFC() {
    let medFA = (<FormArray>this.myForm.get('medications'));

    medFA.push(new FormControl('', [Validators.required, Validators.pattern('.*\\S.*'), Validators.maxLength(25)]));

    this.filteredOptions[medFA.length - 1] = (<FormArray>this.myForm.get('medications')).get((medFA.length - 1).toString()).valueChanges.startWith(null)
      .map(val => val ? this.filter(val) : this.options.slice());
  }


  savePet(pet: Pet) {
    pet.meds.forEach((med, i) => {
      if (!med.remainingDoses || med.totalDoses != this.unchangedTD[i]) {
        med.remainingDoses = med.totalDoses;
      }

      let startDT = new Date(med.startDateTime);

      let hours = (this.notifications[i][2] == "am-0") ? this.notifications[i][0] : (this.notifications[i][0] + 12);

      med.startDateTime = new Date(startDT.getFullYear(), startDT.getMonth(), startDT.getDate(), hours, this.notifications[i][1]).toISOString();
    });
    this.prevImg ? this.petService.uploadImage(this.prevImg, pet, false).then(_ => this.save(pet))
      : this.save(pet);
  }

  save(pet: Pet) {
    const save = this.isNewPet
      ? this.petService.savePet(pet)
      : this.petService.editPet(pet, this.petKey);

    save.then(_ => this.router.navigate(['pet-list']));
  }

  removePet() {
    this.dialogService.confirm('Remove Pet', 'Are you sure you want to remove this pet?').subscribe(res => {
      if (res) {
        this.petService.deleteImage(this.pet.imgId, false);
        this.petService.deleteImage(this.pet.imgId, true);
        this.petService.removePet(this.petKey).then(_ => this.router.navigate(['pet-list']));
      }
    });
  }

  cancel() {
    this.isNewPet && this.petService.deleteImage(this.pet.imgId, true);
    this.router.navigate(['pet-list']);
  }

  finished() {
    return this.myForm.invalid || this.imgUploading;
  }

  onNavigate(add1: boolean, pet: Pet) {
    let address;
    add1 ? address = pet.vetAdd1 : address = pet.vetAdd2;

    let finalAdd = (address) ? address.replace(' ', "+") : "";
    let finalCity = (pet.vetCity) ? "+" + pet.vetCity : "";
    let finalState = (pet.vetState) ? "+" + pet.vetState : "";
    let finalZip = (pet.vetZip) ? "+" + pet.vetZip : "";
    
    window.open('https://www.google.com/maps/place/' + finalAdd + finalCity + finalState + finalZip, '_blank');
  }

  getPlaceholder(selector: string) {
    switch (selector) {
      case 'name':
        return this.isNewPet ? "Enter your pet's name" : 'Pet Name';
      case 'age':
        return this.isNewPet ? "Enter your pet's age" : 'Pet Age';
      default:
        return 'error';
    }
  }

  disableExtension(e: Event) {
    e.stopPropagation();
  }

  ngOnDestroy() {
    this.petSub.unsubscribe();
  }
}
