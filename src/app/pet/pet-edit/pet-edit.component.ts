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
  options: string[] = [];
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
      pet && pet.meds && pet.meds.forEach(meds => this.addMedFC());
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
