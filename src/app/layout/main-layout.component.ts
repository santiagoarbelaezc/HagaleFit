import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from '../components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, BottomNavComponent],
  template: `
    <main class="min-h-screen pb-20 bg-background overflow-x-hidden">
      <router-outlet></router-outlet>
    </main>
    <app-bottom-nav></app-bottom-nav>
  `
})
export class MainLayoutComponent {}
