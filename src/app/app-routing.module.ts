import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { PrivateComponent } from './private/private.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'private',
    component: PrivateComponent,
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    children: [{
      path: '',
      loadChildren: () => import('./private/private.module').then(m => m.PrivateModule)
    }]
  }, {
    path: '**',
    redirectTo: 'private',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
