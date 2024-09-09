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
import { Employee } from 'src/app/interface/employee';
import { CommonService } from 'src/app/services/common.service';
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

  userDetail: Employee = {} as Employee;
  role: string = '';
  constructor(
    private readonly asideNavigationService: AsideNavigationService,
    private readonly themeModeService: ThemeModeService,
    private readonly elementRef: ElementRef,
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly commonService: CommonService,
    private router: Router
  ) {
    this.themeMode = this.themeModeService.$themeMode.value;
  }

  ngOnInit() {
    this.updateProfileIconVisibility();
    this.subscribeToRouteChanges();
    this.getUserDetail();
  }

  getUserDetail() {
    this.authService.getUserId().subscribe(async (value) => {
      if (value) {
        // console.log(value);
        const user =
          (await this.apiService.findUserById(value).toPromise()) ||
          ({} as Employee);
        // this.commonService.
        this.role = this.commonService.translateRole(user.roles);
        this.userDetail = user;
      } else {
        const uid = this.authService.getUID();
        const user =
          (await this.apiService.findUserById(uid).toPromise()) ||
          ({} as Employee);
        // this.commonService.
        this.role = this.commonService.translateRole(user.roles);
        this.userDetail = user;
      }
    });
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
  protected onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/sign-in']);
  }
}
