import { Injectable, Renderer2, RendererFactory2 } from "@angular/core";

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeModeService {
  private themeMode!: BehaviorSubject<boolean>;
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const isDarkMode = localStorage.getItem('themeMode') === 'true';
    this.themeMode = new BehaviorSubject(isDarkMode);
    this.setThemeMode(isDarkMode);
  }

  public get $themeMode(): BehaviorSubject<boolean> {
    return this.themeMode;
  }

  public setThemeMode(isDarkMode: boolean): void {
    localStorage.setItem('themeMode', isDarkMode.toString());
    this.themeMode.next(isDarkMode);

    if (isDarkMode) {
      this.renderer.addClass(document.body, 'dark');
    } else {
      this.renderer.removeClass(document.body, 'dark');
    }
  }
}
