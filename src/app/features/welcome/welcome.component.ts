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
      <div class="mt-16 text-center z-10">
        <h1 class="text-4xl font-extrabold text-ink tracking-tighter animate-fade-up stagger-1 uppercase">
          Hágale <span class="text-primary tracking-tighter">Fit</span> AI
        </h1>
        <p class="mt-4 text-xl text-ink-secondary font-medium max-w-xs mx-auto animate-fade-up stagger-2 leading-tight">
          Tu entrenador de IA.<br/>Tu cuerpo, optimizado.
        </p>
      </div>

      <!-- Center Section: Illustration Placeholder -->
      <div class="z-10 animate-fade-up stagger-3 flex justify-center items-center">
        <div class="relative w-72 h-72">
          <!-- Abstract SVG Illustration -->
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
            <path fill="#FFF0E9" d="M44.7,-76.4C58.2,-69.2,69.7,-57.4,77.3,-43.8C84.8,-30.1,88.4,-15.1,87.3,-0.6C86.2,13.8,80.4,27.7,71.9,39.8C63.4,52,52.2,62.4,39.3,69.9C26.4,77.4,11.7,82,2.3,78.1C-7.2,74.2,-20.5,61.8,-32.7,53.8C-44.9,45.8,-56,42.2,-65.4,34.2C-74.8,26.2,-82.5,13.8,-84,0.9C-85.4,-12.1,-80.6,-25.6,-72.1,-37.7C-63.5,-49.8,-51.2,-60.5,-37.9,-67.7C-24.6,-74.9,-10.3,-78.6,3.6,-84.9C17.5,-91.2,31.2,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
            <circle cx="100" cy="100" r="40" stroke="#FF6B2C" stroke-width="2" fill="none" class="animate-pulse" />
            <path d="M70,100 L130,100 M100,70 L100,130" stroke="#2563EB" stroke-width="4" stroke-linecap="round" />
          </svg>
        </div>
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
