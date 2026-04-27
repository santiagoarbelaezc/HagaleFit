import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PwaInstallComponent } from './shared/components/pwa-install/pwa-install.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PwaInstallComponent],
  template: `
    <router-outlet></router-outlet>
    <app-pwa-install></app-pwa-install>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Hágale Fit';
}
