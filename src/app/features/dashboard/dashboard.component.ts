import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';
import { FitAgentService } from '../../services/fit-agent.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 pt-8 space-y-8 pb-28 bg-[#F9FAFB] min-h-screen">
      <!-- Header Premium -->
      <header class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <div class="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold shadow-button overflow-hidden">
              <span class="text-lg relative z-10">{{ initials() }}</span>
              <div class="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
            </div>
          </div>
          <div>
            <p class="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em]">Resumen Diario</p>
            <h1 class="text-2xl font-bold text-ink -mt-1">{{ profile()?.nombre || 'Fit User' }}</h1>
          </div>
        </div>
      </header>

      <!-- Banner de Entrenamiento (Elevado) -->
      <section class="relative overflow-hidden bg-ink rounded-[2.5rem] p-8 text-white shadow-2xl animate-fade-up">
        <div class="relative z-10">
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span class="font-bold text-[10px] opacity-60 uppercase tracking-[0.2em]">Hoy: {{ todayName() }}</span>
          </div>
          <h2 class="text-4xl font-bold text-white capitalize leading-tight">{{ routineForToday() }}</h2>
          <p class="mt-4 text-sm opacity-50 font-medium">Estrategia enfocada en: {{ profile()?.objetivo?.replace('_', ' ') || 'Mejorar' }}</p>
          
          <div class="mt-8 flex items-center space-x-4">
            <div class="flex -space-x-2">
              <div class="w-8 h-8 rounded-full border-2 border-ink bg-primary-light flex items-center justify-center text-[10px] text-primary">🏃</div>
              <div class="w-8 h-8 rounded-full border-2 border-ink bg-accent-light flex items-center justify-center text-[10px] text-accent">💪</div>
              <div class="w-8 h-8 rounded-full border-2 border-ink bg-success-light flex items-center justify-center text-[10px] text-success">🥗</div>
            </div>
            <span class="text-[10px] font-bold opacity-40 uppercase tracking-widest">+ Plan Activo</span>
          </div>
        </div>
        
        <!-- Elemento decorativo circular -->
        <div class="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-[60px]"></div>
        <div class="absolute -bottom-12 -left-12 w-48 h-48 bg-accent/10 rounded-full blur-[60px]"></div>
      </section>

      <!-- Grid de Métricas y Recomendaciones -->
      <div class="grid grid-cols-2 gap-5">
        
        <!-- Mensaje de la IA -->
        <div class="col-span-2 bg-white border border-border rounded-[2rem] p-6 shadow-sm animate-fade-up stagger-0" *ngIf="fitPlan()?.mensaje_motivacional">
          <div class="flex items-center space-x-3 mb-3">
            <span class="text-xl">🤖</span>
            <span class="text-[10px] font-bold text-ink-muted uppercase tracking-widest">FitAgent Coach</span>
          </div>
          <p class="text-sm font-medium text-ink-secondary leading-relaxed italic">
            "{{ fitPlan()?.mensaje_motivacional }}"
          </p>
        </div>

        <!-- Métricas Físicas (Sin Nivel) -->
        <div class="bg-white border border-border rounded-[2rem] p-5 shadow-sm animate-fade-up stagger-1">
          <div class="w-10 h-10 bg-accent-light rounded-xl flex items-center justify-center text-xl mb-4">⚖️</div>
          <p class="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1">IMC Actual</p>
          <p class="text-xl font-bold text-ink">{{ imc() }}</p>
        </div>

        <div class="bg-white border border-border rounded-[2rem] p-5 shadow-sm animate-fade-up stagger-2">
          <div class="w-10 h-10 bg-success-light rounded-xl flex items-center justify-center text-xl mb-4">🎯</div>
          <p class="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1">Objetivo</p>
          <p class="text-sm font-bold text-ink capitalize">{{ profile()?.objetivo?.replace('_', ' ') || '--' }}</p>
        </div>

        <!-- Recomendaciones Estratégicas -->
        <div class="col-span-2 bg-primary text-white rounded-[2rem] p-6 shadow-button animate-fade-up stagger-3" *ngIf="fitPlan()?.recomendaciones?.length">
          <div class="flex items-center justify-between mb-4">
            <span class="text-[10px] font-bold opacity-70 uppercase tracking-[0.2em]">Recomendaciones</span>
            <span class="text-xl">✨</span>
          </div>
          <ul class="space-y-4">
            @for (rec of fitPlan()?.recomendaciones ?? []; track rec) {
              <li class="flex items-start space-x-3">
                <div class="mt-1 w-1.5 h-1.5 bg-white rounded-full shrink-0"></div>
                <p class="text-xs font-medium leading-relaxed opacity-90">{{ rec }}</p>
              </li>
            }
          </ul>
        </div>

        <!-- Alertas/Advertencias (Solo si existen) -->
        <div class="col-span-2 bg-warning-light border border-warning/20 rounded-[2rem] p-5 animate-fade-up" *ngIf="fitPlan()?.advertencias?.length">
          <div class="flex items-center space-x-2 mb-3">
            <span class="text-lg">⚠️</span>
            <span class="text-[10px] font-bold text-warning uppercase tracking-widest">Advertencias Técnicas</span>
          </div>
          <ul class="space-y-2">
            @for (adv of fitPlan()?.advertencias ?? []; track adv) {
              <li class="text-xs text-ink-secondary font-medium">• {{ adv }}</li>
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

  imc = computed(() => {
    const p = this.profile();
    if (!p || !p.peso || !p.altura) return '--';
    const alturaM = p.altura / 100;
    return (p.peso / (alturaM * alturaM)).toFixed(1);
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
