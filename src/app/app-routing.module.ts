import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { PetListComponent } from './pet/pet-list/pet-list.component';
import { PetEditComponent } from './pet/pet-edit/pet-edit.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', component: HomeComponent },
    { path: 'pet-list', component: PetListComponent, canActivate: [AuthGuard] },
    { path: 'pet-edit/:id', component: PetEditComponent, canActivate: [AuthGuard] },
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '404' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }