import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NgwWowService } from 'ngx-wow';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bayya';

  isLoggedIn$: Observable<boolean>;

  constructor(
    private wowService: NgwWowService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.wowService.init();
    this.checkAuth();
  }

  checkAuth(): void {
    this.isLoggedIn$.pipe(take(1)).subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

}
