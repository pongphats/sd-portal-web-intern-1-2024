import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
} from '@angular/core';

import { AsideNavigationService } from '../navigation-aside/services/aside-navigation/aside-navigation.service';

import { ThemeModeService } from '../../shared/services/theme-mode/theme-mode.service';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
// import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header-system',
  templateUrl: './header-system.component.html',
  styleUrls: ['./header-system.component.scss'],
})
export class HeaderSystemComponent implements OnInit {
  protected themeMode: boolean = false;
  protected showProfile: boolean = false;

  showIconProfile: boolean = false;

  private routerSubscription!: Subscription;

  constructor(
    private readonly asideNavigationService: AsideNavigationService,
    private readonly themeModeService: ThemeModeService,
    private readonly elementRef: ElementRef,
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private router: Router
  ) {
    this.themeMode = this.themeModeService.$themeMode.value;
  }

  ngOnInit() {
    this.updateProfileIconVisibility();
    this.subscribeToRouteChanges();
  }

  private updateProfileIconVisibility() {
    const isLoginPage = this.router.url === '/sign-in';
    this.showIconProfile = !isLoginPage;
  }

  private subscribeToRouteChanges() {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateProfileIconVisibility();
      });
  }

  @HostListener('document:click', ['$event'])
  protected onWindowClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showProfile = false;
    }
  }

  protected onToggleThemeMode(): void {
    this.themeMode = !this.themeMode;
    this.themeModeService.setThemeMode(this.themeMode);
  }

  protected onToggleAsideNavigation(): void {
    this.asideNavigationService.onToggleAsideNavigation();
  }

  protected onToggleProfile(): void {
    this.showProfile = !this.showProfile;
  }

  protected changePhoneFormatThai(phone: string): string {
    if (phone) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return '';
  }

  signOut(){
    localStorage.removeItem('access_token');
    this.router.navigate(['/sign-in']);
  }
}
