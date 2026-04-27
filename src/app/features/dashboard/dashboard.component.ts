import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';
import { FitAgentService } from '../../services/fit-agent.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 pt-6 space-y-6 pb-24">
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
          <span class="font-mono text-xs font-bold opacity-80 uppercase tracking-widest">Plan de Hoy ({{ todayName() }})</span>
          <h2 class="text-3xl mt-1 text-white capitalize">{{ routineForToday() }}</h2>
          <p class="mt-2 text-sm opacity-90">Basado en tu objetivo: {{ profile()?.objetivo?.replace('_', ' ') || 'Mejorar' }}</p>
          
          <button class="mt-6 bg-white text-primary px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-transform active:scale-95 shadow-lg">
            <span>Ver Rutina en la pestaña</span>
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
        <!-- Mensaje Motivacional -->
        <div class="card bg-primary-light border-none p-6 col-span-2 animate-fade-up stagger-0" *ngIf="fitPlan()?.mensaje_motivacional">
          <p class="text-sm font-medium text-primary italic leading-relaxed">
            "{{ fitPlan()?.mensaje_motivacional }}"
          </p>
        </div>

        <!-- Advertencias -->
        <div class="card bg-warning-light border-none p-4 col-span-2 animate-fade-up stagger-1" *ngIf="fitPlan()?.advertencias?.length">
          <span class="text-[10px] font-bold text-warning uppercase">Advertencias de tu plan</span>
          <ul class="mt-2 space-y-1">
            @for (adv of fitPlan()?.advertencias ?? []; track adv) {
              <li class="text-xs text-ink-secondary leading-relaxed">⚠️ {{ adv }}</li>
            }
          </ul>
        </div>

        <!-- Perfil calculado -->
        <div class="card bg-accent-light border-none p-4 col-span-2 animate-fade-up stagger-2">
          <span class="text-[10px] font-bold text-accent uppercase">Tu perfil</span>
          <div class="grid grid-cols-2 gap-2 mt-2">
            <div class="text-xs font-bold text-ink flex items-center space-x-1">
              <span>⚖️</span><span>IMC: {{ fitPlan()?.perfil?.imc }}</span>
            </div>
            <div class="text-xs font-bold text-ink flex items-center space-x-1">
              <span>🎯</span><span class="capitalize">{{ fitPlan()?.perfil?.objetivo }}</span>
            </div>
            <div class="text-xs font-bold text-ink flex items-center space-x-1">
              <span>📊</span><span class="capitalize">{{ fitPlan()?.perfil?.nivel }}</span>
            </div>
            <div class="text-xs font-bold text-ink flex items-center space-x-1">
              <span>📅</span><span>{{ fitPlan()?.perfil?.dias_entrenamiento }} días/semana</span>
            </div>
          </div>
        </div>

        <!-- Recomendaciones -->
        <div class="card bg-surface border-none p-4 col-span-2 animate-fade-up stagger-3" *ngIf="fitPlan()?.recomendaciones?.length">
          <span class="text-[10px] font-bold text-ink-muted uppercase">Recomendaciones</span>
          <ul class="mt-2 space-y-2">
            @for (rec of fitPlan()?.recomendaciones ?? []; track rec) {
              <li class="text-xs text-ink-secondary leading-relaxed">• {{ rec }}</li>
            }
          </ul>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private profileService = inject(ProfileService);
  private fitAgentService = inject(FitAgentService);
  
  profile = this.profileService.profile;
  fitPlan = signal(this.fitAgentService.getLatestResponse());

  initials = computed(() => {
    const name = this.profile()?.nombre || 'Fit User';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  });

  todayName = computed(() => {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return days[new Date().getDay()];
  });

  routineForToday = computed(() => {
    const plan = this.fitPlan();
    if (!plan?.rutina?.length) return 'Entrenamiento IA';
    return plan.rutina.length + ' sesiones generadas';
  });

  ngOnInit() {
    this.fitPlan.set(this.fitAgentService.getLatestResponse());
  }
}
