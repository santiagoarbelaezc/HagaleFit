import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="relative min-h-screen flex flex-col items-center justify-between p-8 bg-white overflow-hidden">
      <!-- Background Decorative Gradient -->
      <div class="absolute -top-[10%] -right-[10%] w-[80%] h-[40%] bg-gradient-to-br from-primary-light to-accent-light opacity-50 blur-3xl transform rotate-12"></div>
      
      <!-- Top Section: Logo & Text -->
      <!-- Center Section: Logo -->
      <div class="z-10 animate-fade-up stagger-3 flex flex-col items-center">
        <img src="assets/logo-hagale.png" alt="Hagale Fit" class="w-64 object-contain">
        <p class="mt-6 text-xl text-ink-secondary font-medium max-w-xs mx-auto text-center leading-tight">
          Tu entrenador de IA.<br/>Tu cuerpo, optimizado.
        </p>
      </div>

      <!-- Bottom Section: CTA -->
      <div class="w-full max-w-xs space-y-6 z-10 animate-fade-up stagger-4 mb-8">
        <button routerLink="/setup" class="btn-primary w-full">
          COMENZAR MI PLAN
        </button>
        <div class="text-center">
          <a class="text-accent font-semibold underline decoration-2 underline-offset-4 cursor-pointer">
            Ya tengo una cuenta
          </a>
        </div>
      </div>
    </div>
  `
})
export class WelcomeComponent {}
