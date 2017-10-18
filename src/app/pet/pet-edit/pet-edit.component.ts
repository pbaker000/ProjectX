import * as firebase from 'firebase/app';
import { Component, OnInit } from '@angular/core';
import { Pet } from '../pet';
import { Observable } from 'rxjs/Observable';
import { PetService } from '../pet.service';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-pet-edit',
  templateUrl: './pet-edit.component.html',
  styleUrls: ['./pet-edit.component.css']
})
export class PetEditComponent implements OnInit {
  isNewPet: boolean;
  petKey: string;
  pet$: Observable<Pet>;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private petService: PetService) {
  }

  ngOnInit() {
    this.petKey = this.activatedRoute.snapshot.params['id'];
    this.isNewPet = this.petKey === 'new';
    !this.isNewPet ? this.getPet() : this.pet$ = Observable.of({}) as Observable<Pet>;
  }

  getPet() {
    this.pet$ = this.petService.getPet(this.petKey);
  }

  savePet(pet: Pet) {
    const save = this.isNewPet
    ? this.petService.savePet(pet)
    : this.petService.editPet(pet, this.petKey);

    save.then(_ => this.router.navigate(['pet-list']));
  }

  removePet() {
    this.petService.removePet(this.petKey)
    .then(_ => this.router.navigate(['pet-list']));
  }
}
