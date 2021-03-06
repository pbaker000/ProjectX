import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs/Observable';
import { AlertDialog } from './alert-dialog/alert-dialog.component';

@Injectable()
export class DialogService {

  constructor(private dialog: MatDialog) { }

  confirm(title: string, message: string): Observable<boolean> {
    let dialogRef: MatDialogRef<ConfirmDialog>;

    dialogRef = this.dialog.open(ConfirmDialog);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }

  alert(title: string, message: string): Observable<boolean> {
    let dialogRef: MatDialogRef<AlertDialog>;

    dialogRef = this.dialog.open(AlertDialog);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }
}

