import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FitAgentService } from '../../services/fit-agent.service';

@Component({
  selector: 'app-routine',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 pt-6 space-y-6 bg-background pb-24">
      <div class="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
        @for (dayName of availableDays(); track dayName; let idx = $index) {
          <button 
            (click)="selectedDayIndex.set(idx)"
            [class]="selectedDayIndex() === idx ? 'bg-primary text-white scale-105 shadow-md' : 'bg-white text-ink-muted border border-border'"
            class="flex-shrink-0 min-w-[3.5rem] px-4 h-12 rounded-2xl font-bold transition-all capitalize shadow-sm"
          >
            {{ dayName | slice:0:3 }}
          </button>
        }
      </div>

      <div class="space-y-3 animate-fade-up">
        <div class="flex items-center space-x-2">
           <span class="bg-primary/10 text-primary rounded-full text-xs font-bold px-3 py-1 uppercase tracking-widest">Fase de Carga</span>
        </div>
        
        <h2 class="text-3xl font-black text-ink capitalize tracking-tight">{{ routineTitle() }}</h2>
        <p class="text-xs text-ink-muted leading-relaxed font-medium bg-surface p-3 rounded-xl border-l-4 border-primary">
          {{ currentRoutineData()?.notas_del_dia || 'Enfócate en la técnica y el control motor hoy.' }}
        </p>
      </div>

      <div class="space-y-4">
        @for (ex of exercises(); track ex.ejercicio; let i = $index) {
          <div class="bg-white rounded-3xl p-6 border border-border shadow-sm group hover:border-primary/30 transition-all">
            <div class="flex justify-between items-start mb-6">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-primary font-mono font-bold text-sm">
                  {{ (i + 1).toString().padStart(2, '0') }}
                </div>
                <h4 class="font-bold text-lg text-ink uppercase tracking-tight">{{ ex.ejercicio }}</h4>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 py-4 border-y border-border/50">
              <div class="text-center">
                <p class="text-xs font-bold text-ink-muted uppercase tracking-widest mb-1">Series</p>
                <p class="font-mono font-bold text-xl text-ink">{{ ex.series }}</p>
              </div>
              <div class="text-center border-x border-border/50">
                <p class="text-xs font-bold text-ink-muted uppercase tracking-widest mb-1">Reps</p>
                <p class="font-mono font-bold text-xl text-ink">{{ ex.reps }}</p>
              </div>
              <div class="text-center">
                <p class="text-xs font-bold text-ink-muted uppercase tracking-widest mb-1">Descanso</p>
                <p class="font-mono font-bold text-xl text-primary">{{ ex.descanso_seg }}s</p>
              </div>
            </div>

            <div class="mt-4 flex items-start space-x-3 text-ink-muted" *ngIf="ex.nota_tecnica">
              <div class="mt-1 w-1.5 h-1.5 bg-primary rounded-full shrink-0"></div>
              <p class="text-sm leading-relaxed font-medium italic">{{ ex.nota_tecnica }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class RoutineComponent implements OnInit {
  private fitAgentService = inject(FitAgentService);
  
  fitPlan = signal(this.fitAgentService.getLatestResponse());
  selectedDayIndex = signal(0);

  availableDays = computed(() => {
    const plan = this.fitPlan();
    if (!plan?.rutina) return [];
    return plan.rutina.map(d => d.nombre_sesion);
  });

  currentRoutineData = computed(() => {
    const plan = this.fitPlan();
    if (!plan?.rutina) return null;
    return plan.rutina[this.selectedDayIndex()] ?? null;
  });

  isRestDay = computed(() => false);

  routineTitle = computed(() => {
    return this.currentRoutineData()?.nombre_sesion || 'Sesión';
  });

  exercises = computed(() => {
    return this.currentRoutineData()?.ejercicios ?? [];
  });

  ngOnInit() {
    this.fitPlan.set(this.fitAgentService.getLatestResponse());
  }
}
