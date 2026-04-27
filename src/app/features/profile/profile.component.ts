import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 pt-12 space-y-10 pb-24 bg-background">
      <!-- Profile Header -->
      <div class="flex flex-col items-center text-center space-y-4">
        <div class="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center text-white text-3xl font-extrabold shadow-button rotate-3">
          {{ initials() }}
        </div>
        <div>
          <h2 class="text-3xl font-bold text-ink">{{ profile()?.nombre || 'Fit User' }}</h2>
          <div class="flex items-center justify-center space-x-2 mt-1">
            <span class="w-2 h-2 bg-success rounded-full"></span>
            <p class="text-primary font-bold text-[10px] uppercase tracking-[0.2em]">{{ objetivoText() }}</p>
          </div>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-2 gap-4">
        <div class="card bg-white border-none p-5 shadow-sm">
          <p class="text-[9px] font-bold text-ink-muted uppercase tracking-widest">IMC Actual</p>
          <div class="flex items-baseline space-x-1 mt-1">
            <p class="text-2xl font-mono font-bold">{{ imc() }}</p>
          </div>
          <span class="text-[9px] text-success font-bold bg-success/10 px-2 py-0.5 rounded-full mt-2 inline-block">SALUDABLE</span>
        </div>
        
        <div class="card bg-white border-none p-5 shadow-sm">
          <p class="text-[9px] font-bold text-ink-muted uppercase tracking-widest">Nivel</p>
          <p class="text-2xl font-bold mt-1 uppercase">{{ profile()?.nivel || 'N/A' }}</p>
          <span class="text-[9px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full mt-2 inline-block">PROGRAMA ACTIVO</span>
        </div>
      </div>

      <!-- Useful Actions -->
      <div class="space-y-3">
        <h3 class="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] pl-1 mb-4">Gestión de Cuenta</h3>
        
        <button (click)="regenerar()" class="w-full bg-white border border-border rounded-2xl flex items-center justify-between p-4 group active:scale-[0.98] transition-all hover:border-primary/50 shadow-sm">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl group-hover:rotate-12 transition-transform">
              ✨
            </div>
            <div class="text-left">
              <p class="font-bold text-sm text-ink">Recalibrar Plan</p>
              <p class="text-[10px] text-ink-muted">Ajusta tu rutina con IA</p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-ink-muted" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>

        <button (click)="logout()" class="w-full bg-white border border-border rounded-2xl flex items-center justify-between p-4 group active:scale-[0.98] transition-all hover:border-error/30 shadow-sm">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center text-xl">
              🚪
            </div>
            <div class="text-left">
              <p class="font-bold text-sm text-error">Cerrar Sesión</p>
              <p class="text-[10px] text-ink-muted">Borrar datos locales</p>
            </div>
          </div>
        </button>
      </div>

      <!-- Branding Footer -->
      <div class="pt-8 text-center space-y-4">
        <div class="w-12 h-1 px-4 bg-border mx-auto rounded-full opacity-20"></div>
        <p class="text-[10px] text-ink-muted font-mono tracking-widest uppercase">Hágale Fit AI v1.2</p>
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

  imc = computed(() => {
    const p = this.profile();
    if (!p || !p.peso || !p.altura) return 0;
    const alturaM = p.altura / 100;
    return (p.peso / (alturaM * alturaM)).toFixed(1);
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
