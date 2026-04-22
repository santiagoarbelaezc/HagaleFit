import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 pt-6 space-y-6">
      <!-- Header -->
      <header class="flex justify-between items-center">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            {{ initials() }}
          </div>
          <div>
            <p class="text-xs font-bold text-ink-muted uppercase tracking-wider">Buenos días</p>
            <h1 class="text-xl -mt-1">{{ profile()?.nombre || 'Fit User' }}</h1>
          </div>
        </div>
        <div class="flex items-center space-x-2 bg-surface px-3 py-2 rounded-full border border-border">
          <span class="text-lg">🔥</span>
          <span class="font-mono font-bold text-ink">5</span>
        </div>
      </header>

      <!-- Main Banner Card -->
      <section class="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-6 text-white shadow-button animate-fade-up">
        <div class="relative z-10">
          <span class="font-mono text-xs font-bold opacity-80 uppercase tracking-widest">Hoy — Martes</span>
          <h2 class="text-3xl mt-1 text-white">Pecho + Bíceps</h2>
          <p class="mt-2 text-sm opacity-90">8 ejercicios · 60 min estimados</p>
          
          <button class="mt-6 bg-white text-primary px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-transform active:scale-95 shadow-lg">
            <span>Iniciar entrenamiento</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <!-- Decorative Circle -->
        <div class="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      </section>

      <!-- Metrics Grid -->
      <div class="grid grid-cols-2 gap-4">
        <div class="card bg-surface border-none p-4 flex flex-col justify-between h-32 animate-fade-up stagger-1">
          <span class="text-[10px] font-bold text-ink-muted uppercase">Calorías</span>
          <div>
            <span class="text-2xl font-mono font-bold text-ink">1.840</span>
            <span class="text-xs text-ink-muted block mt-1">/ 2.200 kcal</span>
          </div>
        </div>

        <div class="card bg-surface border-none p-4 flex flex-col justify-between h-32 animate-fade-up stagger-2">
          <span class="text-[10px] font-bold text-ink-muted uppercase">Macros</span>
          <div class="space-y-1.5 mt-2">
            <div class="flex items-center gap-2">
              <span class="text-[8px] font-bold w-4">P</span>
              <div class="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                <div class="h-full bg-primary" style="width: 70%"></div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[8px] font-bold w-4">C</span>
              <div class="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                <div class="h-full bg-accent" style="width: 50%"></div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[8px] font-bold w-4">G</span>
              <div class="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                <div class="h-full bg-warning" style="width: 40%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-accent-light border-none p-4 flex flex-col justify-between h-32 animate-fade-up stagger-3">
          <span class="text-[10px] font-bold text-accent uppercase">Próxima Comida</span>
          <div>
            <span class="text-lg font-bold text-ink block">Almuerzo</span>
            <span class="text-xs text-accent font-bold mt-1">13:00 PM</span>
          </div>
        </div>

        <div class="card bg-surface border-none p-4 flex flex-col justify-between h-32 animate-fade-up stagger-4">
          <span class="text-[10px] font-bold text-ink-muted uppercase">Agua Hoy</span>
          <div>
            <span class="text-2xl font-mono font-bold text-ink">1.2<span class="text-sm font-normal ml-0.5">L</span></span>
            <span class="text-xs text-ink-muted block mt-1">objetivo: 2.5L</span>
          </div>
        </div>
      </div>

      <!-- Timeline Scroll -->
      <section class="animate-fade-up">
        <h3 class="text-xs font-bold text-ink-muted uppercase tracking-widest mb-4">Agenda de hoy</h3>
        <div class="flex space-x-3 overflow-x-auto pb-4 no-scrollbar">
          <div class="flex-shrink-0 px-6 py-3 rounded-full bg-surface-2 text-ink-muted line-through text-sm font-bold">Desayuno</div>
          <div class="flex-shrink-0 px-6 py-3 rounded-full bg-primary text-white text-sm font-bold shadow-md">Entrenamiento</div>
          <div class="flex-shrink-0 px-6 py-3 rounded-full border border-border text-ink-secondary text-sm font-bold">Almuerzo</div>
          <div class="flex-shrink-0 px-6 py-3 rounded-full border border-border text-ink-secondary text-sm font-bold">Snack</div>
          <div class="flex-shrink-0 px-6 py-3 rounded-full border border-border text-ink-secondary text-sm font-bold">Cena</div>
        </div>
      </section>

      <!-- FAB -->
      <button class="fixed bottom-24 right-6 w-14 h-14 bg-primary rounded-full shadow-[0_4px_24px_rgba(255,107,44,0.5)] flex items-center justify-center text-white z-40 transition-transform active:scale-90 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </button>
    </div>
  `
})
export class DashboardComponent {
  private profileService = inject(ProfileService);
  profile = this.profileService.profile;

  initials = computed(() => {
    const name = this.profile()?.nombre || 'Fit User';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  });
}
