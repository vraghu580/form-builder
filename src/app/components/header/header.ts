import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],  // Keep your style intact
})
export class Header  {
  title: string = '';
  description: string = '';
  icon: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.getDeepestRoute(this.route);
        const data = currentRoute.snapshot.data;
        this.title = data['title'] || '';
        this.description = data['description'] || '';
        this.icon = data['icon'] || '';
      });
  }

  

  private getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  goBack(): void {
    this.location.back();
  }

}