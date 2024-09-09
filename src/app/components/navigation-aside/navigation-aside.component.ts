import { Component, OnInit } from '@angular/core';

import { AsideNavigationService } from './services/aside-navigation/aside-navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-aside',
  templateUrl: './navigation-aside.component.html',
  styleUrls: ['./navigation-aside.component.scss'],
})
export class NavigationAsideComponent implements OnInit {
  protected openAsideNavigation: boolean = false;
  isWelfarePortal = false; // New boolean variable

  constructor(
    private readonly asideNavigationService: AsideNavigationService,
    private router: Router
  ) {
    this.asideNavigationService.$openAsideNavigation.subscribe(
      (openAsideNavigation: boolean) => {
        this.openAsideNavigation = openAsideNavigation;
      }
    );
  }

  ngOnInit(): void {
    this.isWelfarePortal = this.router.url.includes('pccth/wellfare-portal');
  }

  protected onToggleAsideNavigation(): void {
    this.openAsideNavigation = !this.openAsideNavigation;
  }

  protected onCloseAsideNavigationToLink(): void {
    if (this.openAsideNavigation) {
      this.openAsideNavigation = false;
    }
  }
}
