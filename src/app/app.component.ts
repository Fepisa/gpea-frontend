import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'gpea-front';
  userName = '';

  private routerSub: Subscription;

  constructor(private router: Router, private authService: AuthService) {
    // Atualiza o nome a cada navegação (login e logout sempre navegam)
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.userName = this.authService.userName());
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }
}
