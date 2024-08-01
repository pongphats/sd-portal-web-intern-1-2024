import { Component, ElementRef, HostListener } from '@angular/core';

import { AsideNavigationService } from '../navigation-aside/services/aside-navigation/aside-navigation.service';

import { ThemeModeService } from '../../shared/services/theme-mode/theme-mode.service';

@Component({
  selector: 'app-header-system',
  templateUrl: './header-system.component.html',
  styleUrls: ['./header-system.component.scss'],
})
export class HeaderSystemComponent {
  protected themeMode: boolean = false;
  protected showProfile: boolean = false;

  constructor(
    private readonly asideNavigationService: AsideNavigationService,
    private readonly themeModeService: ThemeModeService,
    private readonly elementRef: ElementRef,
  ) {
    this.themeMode = this.themeModeService.$themeMode.value;
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
}
