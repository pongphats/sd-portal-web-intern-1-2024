import { Component } from "@angular/core";

import { AsideNavigationService } from "./services/aside-navigation/aside-navigation.service";

@Component({
  selector: 'app-navigation-aside',
  templateUrl: './navigation-aside.component.html',
  styleUrls: ['./navigation-aside.component.scss'],
})
export class NavigationAsideComponent {
  protected openAsideNavigation: boolean = false;

  constructor(private readonly asideNavigationService: AsideNavigationService) {
    this.asideNavigationService.$openAsideNavigation.subscribe((openAsideNavigation: boolean) => {
      this.openAsideNavigation = openAsideNavigation;
    });
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
