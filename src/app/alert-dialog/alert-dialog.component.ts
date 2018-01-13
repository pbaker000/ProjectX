import { MatDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
    selector: 'app-alert-dialog',
    templateUrl: './alert-dialog.component.html',
    styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialog {

    title: string;
    //date: string;
    message: string;

    constructor(public dialogRef: MatDialogRef<AlertDialog>) {
        //this.date = this.title.split('!')[2];
        //console.log(this.date);
    }
}