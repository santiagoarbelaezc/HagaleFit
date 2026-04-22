import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 pt-12 space-y-8 pb-24">
      <!-- Avatar Section -->
      <div class="flex flex-col items-center text-center space-y-4">
        <div class="relative">
          <div class="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-extrabold shadow-button">
            {{ initials() }}
          </div>
          <button class="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border border-border shadow-sm flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-ink-secondary" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
        <div>
          <h2 class="text-2xl">{{ profile()?.nombre || 'Fit User' }}</h2>
          <p class="text-primary font-bold text-sm uppercase tracking-widest mt-1">Objetivo: {{ objetivoText() }}</p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-4">
        <div class="card bg-surface border-none p-4">
          <p class="text-[10px] font-bold text-ink-muted uppercase">IMC</p>
          <p class="text-xl font-mono font-bold mt-1">24.2</p>
          <span class="text-[10px] text-success font-bold">SALUDABLE</span>
        </div>
        <div class="card bg-surface border-none p-4">
          <p class="text-[10px] font-bold text-ink-muted uppercase">TDEE</p>
          <p class="text-xl font-mono font-bold mt-1">2.450</p>
          <span class="text-[10px] text-ink-muted font-bold">KCAL / DÍA</span>
        </div>
        <div class="card bg-surface border-none p-4">
          <p class="text-[10px] font-bold text-ink-muted uppercase">Semanas</p>
          <p class="text-xl font-mono font-bold mt-1">12</p>
          <span class="text-[10px] text-ink-muted font-bold">ACTIVO</span>
        </div>
        <div class="card bg-surface border-none p-4">
          <p class="text-[10px] font-bold text-ink-muted uppercase">Nivel</p>
          <p class="text-xl font-bold mt-1 uppercase">{{ profile()?.nivel || 'N/A' }}</p>
        </div>
      </div>

      <!-- Settings List -->
      <div class="space-y-2">
        <h3 class="text-xs font-bold text-ink-muted uppercase tracking-widest pl-1 mb-4">Ajustes del Plan</h3>
        
        <button (click)="regenerar()" class="w-full card border-primary/30 text-primary flex items-center justify-between py-4 group active:scale-[0.98] transition-transform">
          <div class="flex items-center space-x-3">
            <span class="text-xl group-hover:rotate-12 transition-transform">✨</span>
            <span class="font-bold text-sm">Regenerar mi plan con IA</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>

        <button class="w-full card border-border flex items-center justify-between py-4 active:scale-[0.98] transition-transform">
          <div class="flex items-center space-x-3">
            <span class="text-xl">🥗</span>
            <span class="font-bold text-sm">Preferencias alimenticias</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-ink-muted" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>

        <button class="w-full card border-border flex items-center justify-between py-4 active:scale-[0.98] transition-transform">
          <div class="flex items-center space-x-3">
            <span class="text-xl">🔔</span>
            <span class="font-bold text-sm">Notificaciones</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-ink-muted" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Logout -->
      <div class="pt-4 text-center">
        <button (click)="logout()" class="text-error font-bold text-xs uppercase tracking-widest hover:underline">
          Cerrar sesión y borrar datos
        </button>
        <p class="text-[10px] text-ink-muted mt-4 font-mono">Hágale Fit AI v1.0.0 — Optimizado por IA</p>
      </div>
    </div>
  `
})
export class ProfileComponent {
  private profileService = inject(ProfileService);
  private router = inject(Router);
  
  profile = this.profileService.profile;

  initials = computed(() => {
    const name = this.profile()?.nombre || 'Fit User';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  });

  objetivoText = computed(() => {
    const obj = this.profile()?.objetivo;
    if (!obj) return 'N/A';
    return obj.replace('_', ' ');
  });

  regenerar() {
    this.router.navigate(['/setup']);
  }

  logout() {
    this.profileService.clearProfile();
    this.router.navigate(['/']);
  }
}
