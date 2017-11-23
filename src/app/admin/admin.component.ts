import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  demoMeds: any;
  doseTypes: any;
  durTypes: any;
  dataRef: AngularFireList<string[]>;
  data$: Observable<string[]>;
  data: any;


  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.db.list(`admin/data`).valueChanges<string[]>()
    .subscribe(data => {
        this.data = data;
        this.demoMeds = data[0];
        this.doseTypes = data[1];
        console.log(this.doseTypes);
        
        this.durTypes = data[2];
      });
  }

  modify(selector: string, isAdd: boolean, index?: number) {
    let selected: any;
    switch(selector)
    {
      case 'demo':
        selected = this.demoMeds;
        break;
      case 'dose':
        selected = this.doseTypes;
        break;
      case 'dur':
        selected = this.durTypes;
        break;
    }
    isAdd ? selector == 'demo' ? selected.push('') 
      : selected.push({value: '', viewValue: ''}) 
      : selected.splice(index, 1);
  }

  save() {
    this.db.list(`admin`).set(`data`, this.data)
    .then(_ => console.log('Success, saved'));
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }
}
