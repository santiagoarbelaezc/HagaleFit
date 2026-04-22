import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-routine',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 pt-6 space-y-6">
      <!-- Day Selector -->
      <div class="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
        @for (day of ['L', 'M', 'X', 'J', 'V', 'S', 'D']; track $index) {
          <button 
            (click)="selectedDay.set($index)"
            [class]="selectedDay() === $index ? 'bg-primary text-white scale-105 shadow-md' : 'bg-surface text-ink-muted'"
            class="flex-shrink-0 w-12 h-12 rounded-2xl font-bold transition-all"
          >
            {{ day }}
          </button>
        }
      </div>

      <!-- Header -->
      <div class="space-y-2 animate-fade-up">
        <span class="bg-accent-light text-accent rounded-full text-xs font-bold px-3 py-1 uppercase tracking-wider">Pecho + Tríceps</span>
        <h2 class="text-3xl">Push Day A</h2>
        <div class="flex items-center space-x-2">
          <div class="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
            <div class="h-full bg-primary transition-all duration-500" [style.width]="progress()"></div>
          </div>
          <span class="text-xs font-bold text-ink-muted">2/8 ej.</span>
        </div>
      </div>

      <!-- Exercises List -->
      <div class="space-y-4 pb-12">
        @for (ex of exercises; track ex.id) {
          <div 
            class="card transition-all duration-300"
            [class.border-success]="ex.completed"
            [class.bg-success-light]="ex.completed"
          >
            <div class="flex justify-between items-start">
              <div class="flex items-center space-x-3">
                <span class="font-mono text-xs text-ink-muted">{{ ex.id }}</span>
                <h4 class="font-bold uppercase tracking-tight">{{ ex.name }}</h4>
              </div>
              <div *ngIf="ex.completed" class="text-success flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span class="text-[10px] font-bold">HECHO</span>
              </div>
            </div>
            
            <p class="text-xs text-ink-muted mt-1">{{ ex.target }}</p>

            <div class="flex items-center gap-4 mt-6">
              <div class="text-center">
                <p class="text-[10px] font-bold text-ink-muted opacity-60">SERIES</p>
                <p class="font-mono font-bold">{{ ex.sets }}</p>
              </div>
              <div class="w-px h-6 bg-border"></div>
              <div class="text-center flex-1">
                <p class="text-[10px] font-bold text-ink-muted opacity-60">REPS</p>
                <p class="font-mono font-bold">{{ ex.reps }}</p>
              </div>
              <div class="w-px h-6 bg-border"></div>
              <div class="text-center">
                <p class="text-[10px] font-bold text-ink-muted opacity-60">DESCANSO</p>
                <p class="font-mono font-bold">{{ ex.rest }}s</p>
              </div>
            </div>

            <!-- Set Tracker -->
            <div class="flex flex-wrap gap-2 mt-6">
              @for (set of [1,2,3,4]; track $index) {
                <button 
                  (click)="toggleSet(ex.id)"
                  [class]="ex.completed ? 'bg-success text-white' : 'bg-surface-2 text-ink-secondary'"
                  class="h-10 px-4 rounded-xl font-bold text-sm border border-border"
                >
                  SET {{ set }}
                </button>
              }
            </div>

            <div class="mt-4 p-3 bg-surface rounded-xl flex items-start space-x-2">
              <span class="text-lg">💡</span>
              <p class="text-xs text-ink-secondary leading-relaxed pt-0.5">Controla la bajada 3 segundos para máxima tensión.</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .bg-success-light { background-color: rgba(22, 163, 74, 0.05); }
  `]
})
export class RoutineComponent {
  selectedDay = signal(1); // Martes
  progress = signal('25%');

  exercises = [
    { id: '01', name: 'Press de Banca', target: 'Pecho mayor', sets: 4, reps: '8-10', rest: 90, completed: true },
    { id: '02', name: 'Aperturas con Mancuernas', target: 'Pecho lateral', sets: 3, reps: '12-15', rest: 60, completed: false },
    { id: '03', name: 'Press Francés', target: 'Tríceps', sets: 3, reps: '10-12', rest: 60, completed: false }
  ];

  toggleSet(exId: string) {
    // Logic for individual sets would go here
  }
}
