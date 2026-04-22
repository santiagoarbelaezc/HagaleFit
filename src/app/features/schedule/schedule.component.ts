import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 pt-6 space-y-8 pb-24">
      <header>
        <h2 class="text-3xl">Tu Horario</h2>
        <p class="text-ink-muted text-sm mt-1">Plan optimizado para hoy, 21 de Abril.</p>
      </header>

      <!-- Vertical Timeline -->
      <div class="relative pl-8 space-y-10 animate-fade-up">
        <!-- Vertical Line -->
        <div class="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border"></div>

        <!-- Event 1 -->
        <div class="relative">
          <!-- Dot -->
          <div class="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-ink-muted z-10"></div>
          
          <div class="flex flex-col">
            <span class="font-mono text-xs font-bold text-ink-muted">07:00 AM</span>
            <div class="card bg-surface border-none mt-2 p-4">
              <h4 class="font-bold text-sm">Levantarse + Hidratación</h4>
              <p class="text-[10px] text-ink-muted mt-0.5">500ml agua con limón</p>
            </div>
          </div>
        </div>

        <!-- Event 2 (Active) -->
        <div class="relative">
          <!-- Pulse Indicator -->
          <div class="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-primary/20 animate-ping z-0"></div>
          <div class="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-primary z-10 shadow-sm"></div>
          
          <div class="flex flex-col">
            <div class="flex items-center space-x-3">
              <span class="font-mono text-xs font-bold text-primary">08:00 AM</span>
              <span class="bg-primary text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">AHORA</span>
            </div>
            <div class="card border-primary/20 bg-primary-light mt-2 p-4">
              <h4 class="font-bold text-sm text-primary">Entrenamiento: Pecho + Bíceps</h4>
              <p class="text-[10px] text-primary-dark mt-0.5">Enfoque: Hipertrofia · 60 min</p>
              <button class="mt-3 text-[10px] font-bold text-primary flex items-center space-x-1">
                <span>VER DETALLES</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Event 3 -->
        <div class="relative opacity-60">
          <div class="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-accent z-10"></div>
          
          <div class="flex flex-col">
            <span class="font-mono text-xs font-bold text-accent">09:30 AM</span>
            <div class="card bg-accent-light border-none mt-2 p-4">
              <h4 class="font-bold text-sm">Post-Entrenamiento</h4>
              <p class="text-[10px] text-accent-dark mt-0.5">Batido de proteína + Banana</p>
            </div>
          </div>
        </div>

        <!-- Event 4 -->
        <div class="relative opacity-60">
          <div class="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-ink-muted z-10"></div>
          
          <div class="flex flex-col">
            <span class="font-mono text-xs font-bold text-ink-muted">11:00 AM</span>
            <div class="card bg-surface border-none mt-2 p-4">
              <h4 class="font-bold text-sm">Trabajo Focalizado</h4>
              <p class="text-[10px] text-ink-muted mt-0.5">Periodo de máxima productividad</p>
            </div>
          </div>
        </div>

        <!-- Event 5 -->
        <div class="relative opacity-60">
          <div class="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-accent z-10"></div>
          
          <div class="flex flex-col">
            <span class="font-mono text-xs font-bold text-accent">01:30 PM</span>
            <div class="card bg-accent-light border-none mt-2 p-4">
              <h4 class="font-bold text-sm">Almuerzo Nutritivo</h4>
              <p class="text-[10px] text-accent-dark mt-0.5">Pollo con arroz y aguacate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ScheduleComponent {}
