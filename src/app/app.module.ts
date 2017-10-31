import 'hammerjs';
import 'firebase/storage';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2'
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AppRoutingModule } from './app-routing.module';
import { PetListComponent } from './pet/pet-list/pet-list.component';
import { PetEditComponent } from './pet/pet-edit/pet-edit.component';
import { HomeComponent } from './home/home.component';
import { MatCardModule } from '@angular/material';
import { PetService } from './pet/pet.service';
import { MatInputModule } from '@angular/material';
import { MatDialogModule } from '@angular/material';
import { DialogService } from './dialog.service';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog.component';
import { Ng2ImgToolsModule } from 'ng2-img-tools'; 
//import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';

const firebaseConfig = {
  apiKey: "AIzaSyB-JUvVxJTK-yHp9P91eThua2_8XVz2NFs",
  authDomain: "projectx-86abc.firebaseapp.com",
  databaseURL: "https://projectx-86abc.firebaseio.com",
  projectId: "projectx-86abc",
  storageBucket: "projectx-86abc.appspot.com",
  messagingSenderId: "677894490136"
};

@NgModule({
  declarations: [
    AppComponent,
    PetListComponent,
    PetEditComponent,
    HomeComponent,
    ConfirmDialog,
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    AngularFireDatabaseModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    Ng2ImgToolsModule
    //ImageCropperComponent,
    //CropperSettings
  ],
  providers: [PetService, DialogService],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialog]
})
export class AppModule { }
