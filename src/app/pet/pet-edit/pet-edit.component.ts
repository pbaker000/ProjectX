import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { Pet } from '../pet';
import { Observable } from 'rxjs/Observable';
import { PetService } from '../pet.service';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/observable/of';
import { DialogService } from '../../dialog.service';
import { UUID } from 'angular2-uuid';
import { EXIF } from 'exif-js';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { Exif } from 'ng2-img-cropper/src/exif'
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';


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
  buttonDisabled: boolean;
  name = new FormControl('', [Validators.required]);


  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private petService: PetService,
    private dialogService: DialogService,
    private authService: AuthService
    /*private ng2ImgToolsService: Ng2ImgToolsService*/) {
  }

  ngOnInit() {
    this.petKey = this.activatedRoute.snapshot.params['id'];
    this.isNewPet = this.petKey === 'new';

    !this.isNewPet ? this.getPet() : this.pet$ = Observable.of({}) as Observable<Pet>;

    this.pet$.subscribe(pet => {
      this.pet = pet;
      this.isNewPet && (pet.imgId = UUID.UUID());
      // setTimeout(() => {
      //   let img1 = document.getElementById("img1") as HTMLImageElement;

      //   Exif.getData(img1, () => {
      //     let orientation = Exif.getTag(img1, 'Orientation');
      //     console.log(orientation);

      //   });
      //this.ng2ImgToolsService.getEXIFOrientedImage(img1).then((img) => {
      //this.img2 = img.src;
      //console.log("hello");


      //   console.log(img1);
      //   EXIF.getData(img1,() => {
      //     //let orientation = EXIF.getTag(img1, "Orientation");
      //     console.log("hello");
      //   });
      //}, 100);

    });

  }

  getErrorMessage() {
    return this.name.hasError('required') ? 'You must enter a pet name' : '';
  }

  petRemoveDialog() {
    this.dialogService
      .confirm('Remove Pet', 'Are you sure you want to remove this pet?')
      .subscribe(res => {
        if (res) {
          this.removePet();
        }
      });
  }

  getPet() {
    this.pet$ = this.petService.getPet(this.petKey, this.authService.user.uid);
  }

  uploadImage(event: any, pet: Pet) {
    this.buttonDisabled = true;
    const file = event.srcElement.files[0];
    const storageRef = firebase.storage().ref(`pets/${pet.imgId}`);
    storageRef.put(file)
      .then(uploadTask => {
        pet.imageUrl = uploadTask.downloadURL;
        this.buttonDisabled = false;
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
    this.router.navigate(['pet-list']);
  }

  finished() {
    return this.name.hasError('required') || this.buttonDisabled;
  }

}
