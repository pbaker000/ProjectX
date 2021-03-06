import 'hammerjs';
import 'firebase/storage';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2'
import { AppComponent } from './app.component';
import { MatToolbarModule, MatSelectModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
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
import { AlertDialog } from './alert-dialog/alert-dialog.component';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Ng2ImgToolsModule } from 'ng2-img-tools'; 
//import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { MatExpansionModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material';
import { MatOptionModule } from '@angular/material';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './admin/admin.guard';
import { MatDatepickerModule } from '@angular/material';
import { MatNativeDateModule } from '@angular/material';
import { MessagingService } from './messaging.service';
import { NotificationComponent } from './notification/notification.component';
import { NotificationService } from './notification/notification.service';
import { MatSlideToggleModule } from '@angular/material';
import { EmergencyComponent } from './emergency/emergency.component';

@NgModule({
  declarations: [
    AppComponent,
    PetListComponent,
    PetEditComponent,
    HomeComponent,
    ConfirmDialog,
    AlertDialog,
    NotFoundComponent,
    AdminComponent,
    NotificationComponent,
    EmergencyComponent,
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
    AngularFireModule.initializeApp(environment.firebaseConfig),
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    Ng2ImgToolsModule,
    AngularFireAuthModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule
    //ImageCropperComponent,
    //CropperSettings
  ],
  providers: [AuthGuard, AuthService, PetService, DialogService, AdminGuard, MessagingService, NotificationService],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialog, AlertDialog]
})
export class AppModule { }
