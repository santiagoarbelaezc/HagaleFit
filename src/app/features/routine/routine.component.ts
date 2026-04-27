import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FitAgentService } from '../../services/fit-agent.service';

@Component({
  selector: 'app-routine',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 pt-6 space-y-6">
      <!-- Day Selector -->
      <div class="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
        @for (dayName of availableDays(); track dayName; let idx = $index) {
          <button 
            (click)="selectedDayIndex.set(idx)"
            [class]="selectedDayIndex() === idx ? 'bg-primary text-white scale-105 shadow-md' : 'bg-surface text-ink-muted'"
            class="flex-shrink-0 min-w-[3rem] px-3 h-12 rounded-2xl font-bold transition-all capitalize"
          >
            {{ dayName | slice:0:3 }}
          </button>
        }
      </div>

      <!-- Header -->
      <div class="space-y-2 animate-fade-up">
        <span *ngIf="isRestDay()" class="bg-blue-100 text-[#2563EB] rounded-full text-xs font-bold px-3 py-1 uppercase tracking-wider">Recuperación</span>
        <span *ngIf="!isRestDay()" class="bg-accent-light text-accent rounded-full text-xs font-bold px-3 py-1 uppercase tracking-wider">Entrenamiento</span>
        
        <h2 class="text-3xl capitalize">{{ routineTitle() }}</h2>
        <p class="text-sm text-ink-muted italic mt-1">{{ currentRoutineData()?.notas_del_dia }}</p>
        
        <div *ngIf="!isRestDay()" class="flex items-center space-x-2">
          <div class="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
            <div class="h-full bg-primary transition-all duration-500" [style.width]="progress()"></div>
          </div>
          <span class="text-xs font-bold text-ink-muted">{{ completedExercisesCount() }}/{{ exercises().length }} ej.</span>
        </div>
      </div>

      <!-- Exercises List -->
      <div class="space-y-4 pb-12">
        @if (isRestDay()) {
          <div class="text-center py-10 bg-surface rounded-2xl text-ink-muted border border-border">
             Hoy es un día de descanso o recuperación activa. 
          </div>
        } @else {
          @for (ex of exercises(); track ex.ejercicio; let i = $index) {
            <div 
              class="card transition-all duration-300 border-2"
              [class.border-success]="isCompleted(i)"
              [class.bg-success-light]="isCompleted(i)"
              [class.border-transparent]="!isCompleted(i)"
            >
              <div class="flex justify-between items-start">
                <div class="flex items-center space-x-3">
                  <span class="font-mono text-xs text-ink-muted">{{ (i + 1).toString().padStart(2, '0') }}</span>
                  <h4 class="font-bold uppercase tracking-tight">{{ ex.ejercicio }}</h4>
                </div>
                <div *ngIf="isCompleted(i)" class="text-success flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-[10px] font-bold">HECHO</span>
                </div>
              </div>
              


              <div class="flex items-center gap-4 mt-6">
                <div class="text-center">
                  <p class="text-[10px] font-bold text-ink-muted opacity-60">SERIES</p>
                  <p class="font-mono font-bold text-lg">{{ ex.series }}</p>
                </div>
                <div class="w-px h-6 bg-border"></div>
                <div class="text-center flex-1">
                  <p class="text-[10px] font-bold text-ink-muted opacity-60">REPS</p>
                  <p class="font-mono font-bold text-lg">{{ ex.reps }}</p>
                </div>
                <div class="w-px h-6 bg-border"></div>
                <div class="text-center">
                  <p class="text-[10px] font-bold text-ink-muted opacity-60">DESCANSO</p>
                  <p class="font-mono font-bold text-lg text-primary">{{ ex.descanso_seg }}<span class="text-xs ml-0.5">s</span></p>
                </div>
              </div>

              <!-- Set Tracker -->
              <div class="flex flex-wrap gap-2 mt-6">
                @for (set of generateArray(ex.series); track $index) {
                  <button 
                    (click)="toggleSet(i, $index)"
                    [class]="isSetCompleted(i, $index) ? 'bg-success text-white border-success' : 'bg-surface-2 text-ink-secondary border-border'"
                    class="h-10 px-4 rounded-xl font-bold text-sm border transition-colors active:scale-95"
                  >
                    SET {{ $index + 1 }}
                  </button>
                }
              </div>

              <div class="mt-4 p-3 bg-surface rounded-xl flex items-start space-x-2 border border-border" *ngIf="ex.nota_tecnica">
                <span class="text-lg">💡</span>
                <p class="text-xs text-ink-secondary leading-relaxed pt-0.5 italic">"{{ ex.nota_tecnica }}"</p>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .bg-success-light { background-color: rgba(22, 163, 74, 0.05); }
  `]
})
export class RoutineComponent implements OnInit {
  private fitAgentService = inject(FitAgentService);
  
  fitPlan = signal(this.fitAgentService.getLatestResponse());
  selectedDayIndex = signal(0);
  
  // Maps exercise index -> Set of completed set indices
  completedSets = signal<Record<number, Set<number>>>({});

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

  completedExercisesCount = computed(() => {
    let count = 0;
    const exs = this.exercises();
    if (!exs) return 0;
    
    for (let i = 0; i < exs.length; i++) {
      if (this.isCompleted(i)) count++;
    }
    return count;
  });

  progress = computed(() => {
    const total = this.exercises()?.length || 1;
    const completed = this.completedExercisesCount();
    return (completed / total) * 100 + '%';
  });

  ngOnInit() {
    this.fitPlan.set(this.fitAgentService.getLatestResponse());
  }

  generateArray(n: number | string): number[] {
    const count = typeof n === 'string' ? parseInt(n, 10) : n;
    return Array.from({ length: isNaN(count) ? 0 : count }, (_, i) => i);
  }

  toggleSet(exIndex: number, setIndex: number) {
    const current = { ...this.completedSets() };
    if (!current[exIndex]) {
      current[exIndex] = new Set<number>();
    }
    
    if (current[exIndex].has(setIndex)) {
      current[exIndex].delete(setIndex);
    } else {
      current[exIndex].add(setIndex);
    }
    
    this.completedSets.set(current);
  }

  isSetCompleted(exIndex: number, setIndex: number): boolean {
    return this.completedSets()[exIndex]?.has(setIndex) || false;
  }

  isCompleted(exIndex: number): boolean {
    const ex = this.exercises()[exIndex];
    if (!ex) return false;
    const setsNeeded = typeof ex.series === 'string' ? parseInt(ex.series, 10) : ex.series;
    const setsDone = this.completedSets()[exIndex]?.size || 0;
    return setsDone >= setsNeeded;
  }
}
