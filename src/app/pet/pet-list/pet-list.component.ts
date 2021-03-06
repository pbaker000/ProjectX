import { Component, OnInit } from '@angular/core';
import { Pet } from '../pet';
import { AngularFireObject, AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { PetService } from '../pet.service';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-pet-list',
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.css']
})
export class PetListComponent implements OnInit {
  pets$: Observable<Pet[]>;


  constructor(private petService: PetService, private authService: AuthService) {
  }

  ngOnInit() {
    this.getPets();
  }
  getPets()
  {
    this.pets$ = this.petService.getPets();
  }
}
