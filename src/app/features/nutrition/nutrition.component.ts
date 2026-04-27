import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FitAgentService } from '../../services/fit-agent.service';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 pt-6 space-y-6 pb-24">
      <!-- Week Strip -->
      <div class="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
        @for (dayName of availableDays(); track dayName; let idx = $index) {
          <button 
            (click)="selectedDayIndex.set(idx)"
            [class]="selectedDayIndex() === idx ? 'bg-primary text-white shadow-sm scale-105' : 'bg-surface text-ink-muted'"
            class="flex-shrink-0 min-w-[3rem] px-3 h-12 rounded-2xl font-bold transition-all capitalize border border-border"
          >
            {{ dayName | slice:0:3 }}
          </button>
        }
      </div>

      <!-- Calories Overview -->
      <div class="relative overflow-hidden card border-none bg-surface p-8 text-center animate-fade-up">
        <h3 class="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">Calorías Sugeridas</h3>
        <div class="flex flex-col items-center">
          <div class="flex items-baseline space-x-1">
            <span class="text-5xl font-mono font-bold text-ink">{{ totalCalories() }}</span>
            <span class="text-xl text-ink-muted">kcal</span>
          </div>
          <span class="text-sm font-bold text-ink-muted mt-1 uppercase">{{ currentDayName() }}</span>
        </div>
      </div>

      <!-- Meal List -->
      <section class="space-y-4 animate-fade-up stagger-1">
        <h3 class="text-xs font-bold text-ink-muted uppercase tracking-widest pl-1">Plan de comidas</h3>
        
        @if (mealsForToday().length === 0) {
          <div class="text-center py-8 text-ink-muted bg-surface rounded-2xl border border-border">
            No hay plan alimenticio para este día.
          </div>
        }

        @for (meal of mealsForToday(); track meal.momento; let i = $index) {
          <div class="card border-border p-5 space-y-4 animate-fade-up" [style.animation-delay]="(i * 100) + 'ms'">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-surface-2 rounded-xl flex items-center justify-center text-xl">
                  {{ getMealIcon(meal.momento) }}
                </div>
                <h4 class="font-bold text-sm capitalize">{{ meal.momento }}</h4>
              </div>
              <p class="text-[10px] text-primary font-bold">{{ meal.calorias }} kcal</p>
            </div>
            
            <div class="space-y-3 pt-3 border-t border-border/50">
              <div class="flex justify-between items-start space-x-4">
                <span class="text-xs text-ink-secondary leading-relaxed">{{ meal.alimento }}</span>
                <span class="text-[10px] font-mono text-ink-muted whitespace-nowrap bg-surface-2 px-2 py-1 rounded">{{ meal.cantidad_g }}g</span>
              </div>
            </div>
          </div>
        }
      </section>
    </div>
  `
})
export class NutritionComponent implements OnInit {
  private fitAgentService = inject(FitAgentService);
  
  fitPlan = signal(this.fitAgentService.getLatestResponse());
  selectedDayIndex = signal(0);

  availableDays = computed(() => {
    return ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  });

  currentDayName = computed(() => {
    return this.availableDays()[this.selectedDayIndex()];
  });

  mealsForToday = computed<any[]>(() => {
    return [];
  });

  totalCalories = computed(() => {
    let sum = 0;
    const meals = this.mealsForToday();
    if (!meals) return sum;
    for (const meal of meals) {
      if (meal && typeof meal.calorias === 'number') {
        sum += meal.calorias;
      }
    }
    return sum;
  });

  ngOnInit() {
    this.fitPlan.set(this.fitAgentService.getLatestResponse());
  }

  getMealIcon(mealName: string): string {
    const name = mealName.toLowerCase();
    if (name.includes('desayuno')) return '☕';
    if (name.includes('almuerzo')) return '🥩';
    if (name.includes('cena')) return '🥗';
    if (name.includes('snack') || name.includes('merienda')) return '🍏';
    return '🍽️';
  }
}

