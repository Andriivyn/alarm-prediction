import {Component} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {filter, map} from "rxjs";

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, RouterLink, NgOptimizedImage],
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  activeTab: string;

  constructor(private router: Router) {
      router.events.pipe(
          filter(event => event instanceof NavigationEnd)
      ).subscribe((event:any) => {
              this.activeTab = event.url.slice(1);
          });
  }
}
