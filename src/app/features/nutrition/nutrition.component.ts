import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 pt-6 space-y-6 pb-24">
      <!-- Week Strip -->
      <div class="flex justify-between items-center bg-surface p-1 rounded-2xl border border-border">
        @for (day of ['L', 'M', 'X', 'J', 'V', 'S', 'D']; track $index) {
          <button 
            [class]="$index === 1 ? 'bg-white text-primary shadow-sm' : 'text-ink-muted'"
            class="flex-1 py-3 text-sm font-bold rounded-xl transition-all"
          >
            {{ day }}
          </button>
        }
      </div>

      <!-- Calories Overview -->
      <div class="relative overflow-hidden card border-none bg-surface p-8 text-center">
        <h3 class="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">Calorías Totales</h3>
        <div class="flex flex-col items-center">
          <div class="flex items-baseline space-x-1">
            <span class="text-5xl font-mono font-bold text-ink">1.840</span>
            <span class="text-xl text-ink-muted">/ 2.200</span>
          </div>
          <span class="text-sm font-bold text-ink-muted mt-1 uppercase">kcal consumidas</span>
        </div>
        
        <!-- Simple SVG Donut -->
        <div class="mt-8 relative w-32 h-32 mx-auto">
          <svg class="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="50" stroke="#EEF1F6" stroke-width="12" fill="none" />
            <circle cx="64" cy="64" r="50" stroke="#FF6B2C" stroke-width="12" fill="none" 
              stroke-dasharray="314.16" stroke-dashoffset="100" />
            <circle cx="64" cy="64" r="50" stroke="#2563EB" stroke-width="12" fill="none" 
              stroke-dasharray="314.16" stroke-dashoffset="240" />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-2xl">🥗</span>
          </div>
        </div>
      </div>

      <!-- Macros Horizontal Cards -->
      <div class="grid grid-cols-3 gap-3">
        <div class="card p-3 space-y-3">
          <span class="text-[10px] font-bold text-primary uppercase">Proteína</span>
          <p class="font-mono font-bold text-sm">120/150g</p>
          <div class="h-1 bg-surface-2 rounded-full overflow-hidden">
            <div class="h-full bg-primary" style="width: 80%"></div>
          </div>
        </div>
        <div class="card p-3 space-y-3">
          <span class="text-[10px] font-bold text-accent uppercase">Carbos</span>
          <p class="font-mono font-bold text-sm">210/250g</p>
          <div class="h-1 bg-surface-2 rounded-full overflow-hidden">
            <div class="h-full bg-accent" style="width: 84%"></div>
          </div>
        </div>
        <div class="card p-3 space-y-3">
          <span class="text-[10px] font-bold text-warning uppercase">Grasas</span>
          <p class="font-mono font-bold text-sm">52/65g</p>
          <div class="h-1 bg-surface-2 rounded-full overflow-hidden">
            <div class="h-full bg-warning" style="width: 80%"></div>
          </div>
        </div>
      </div>

      <!-- Meal List -->
      <section class="space-y-4">
        <h3 class="text-xs font-bold text-ink-muted uppercase tracking-widest pl-1">Comidas de hoy</h3>
        
        <!-- Desayuno (Consumido) -->
        <div class="card border-success/30 bg-success/5 p-4 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">☕</div>
            <div>
              <h4 class="font-bold text-sm">Desayuno</h4>
              <p class="text-[10px] text-ink-muted font-mono">420 kcal · 35g P</p>
            </div>
          </div>
          <div class="w-6 h-6 bg-success rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- Almuerzo (Pendiente) -->
        <div class="card border-border p-4 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">🥩</div>
            <div>
              <h4 class="font-bold text-sm">Almuerzo</h4>
              <p class="text-[10px] text-ink-muted font-mono">650 kcal · 55g P</p>
            </div>
          </div>
          <button class="text-[10px] font-bold text-primary px-3 py-1.5 rounded-lg border border-primary/30">
            REGISTRAR
          </button>
        </div>

        <!-- Snack (Expandido/Detalle) -->
        <div class="card border-primary/20 p-5 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">🍏</div>
              <h4 class="font-bold text-sm">Snack tarde</h4>
            </div>
            <p class="text-[10px] text-primary font-bold">250 kcal</p>
          </div>
          
          <div class="space-y-3 pt-3 border-t border-border/50">
            <div class="flex justify-between items-center">
              <span class="text-xs text-ink-secondary">Yogur Griego (200g)</span>
              <span class="text-[10px] font-mono text-ink-muted">120 kcal</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-ink-secondary">Manzana Verde (1 u)</span>
              <span class="text-[10px] font-mono text-ink-muted">80 kcal</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-ink-secondary">Nueces (15g)</span>
              <span class="text-[10px] font-mono text-ink-muted">50 kcal</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class NutritionComponent {}
