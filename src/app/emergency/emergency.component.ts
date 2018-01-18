import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Pet } from '../pet/pet';
import { PetService } from '../pet/pet.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.component.html',
  styleUrls: ['./emergency.component.css']
})
export class EmergencyComponent implements OnInit {

  pets$: Observable<Pet[]>;


  constructor(private petService: PetService) {
  }

  ngOnInit() {
    this.getPets();
  }
  getPets() {
    this.pets$ = this.petService.getPets();
  }


  onNavigate(pet: Pet) {
    let address = pet.vetAdd1 + " " + pet.vetAdd2;

    let finalAdd = (address) ? address.replace(' ', "+") : "";
    let finalCity = (pet.vetCity) ? "+" + pet.vetCity : "";
    let finalState = (pet.vetState) ? "+" + pet.vetState : "";
    let finalZip = (pet.vetZip) ? "+" + pet.vetZip : "";

    window.open('https://www.google.com/maps/place/' + finalAdd + finalCity + finalState + finalZip, '_blank');
  }
}
