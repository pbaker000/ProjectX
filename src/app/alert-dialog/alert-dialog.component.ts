import { MatDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
    selector: 'app-alert-dialog',
    templateUrl: './alert-dialog.component.html',
    styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialog {

    title: string;
    message: string;

    constructor(public dialogRef: MatDialogRef<AlertDialog>) {

    }
}