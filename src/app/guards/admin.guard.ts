import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Libera a rota somente para usuários autenticados com a role Admin.
 * Não autenticado vai para o login; autenticado sem Admin volta para a lista de laudos.
 */
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private as: AuthService,
    private router: Router
  ) { }

  canActivate(): boolean | UrlTree {
    if (!this.as.userAuthenticated()) {
      return this.router.parseUrl('/login');
    }
    if (this.as.userIsAdmin()) {
      return true;
    }
    return this.router.parseUrl('/private/laudos');
  }

}
