import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { LaudosCadComponent } from './laudos-cad/laudos-cad.component';
import { LaudosListComponent } from './laudos-list/laudos-list.component';
import { UsersCadComponent } from './users-cad/users-cad.component';
import { UsersListComponent } from './users-list/users-list.component';

const routes: Routes = [
  {
    path: 'laudos', 
    canActivate: [AuthGuard],
    component: LaudosListComponent
  }, {
    path: 'laudo',
    canActivate: [AuthGuard],
    component: LaudosCadComponent
  }, {
    path: 'laudo/:id',
    canActivate: [AuthGuard],
    component: LaudosCadComponent
  }, {
    path: 'users', 
    canActivate: [AuthGuard],
    component: UsersListComponent
  }, {
    path: 'user',
    canActivate: [AuthGuard],
    component: UsersCadComponent
  }, {
    path: 'user/:id',
    canActivate: [AuthGuard],
    component: UsersCadComponent
  }, {
    path: '**',
    redirectTo: 'laudos',
    pathMatch: 'full'
  }, {
    path: '',
    redirectTo: 'laudos',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
