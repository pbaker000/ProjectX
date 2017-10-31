import { MatDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialog {

    title: string;
    message: string;

    constructor(public dialogRef: MatDialogRef<ConfirmDialog>) {

    }
}