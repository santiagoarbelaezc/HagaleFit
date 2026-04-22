import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService, UserProfile } from '../../core/services/profile.service';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setup.component.html'
})
export class SetupComponent {
  private profileService = inject(ProfileService);
  private router = inject(Router);

  currentStep = signal(1);
  totalSteps = 4;

  progressWidth = computed(() => {
    return (this.currentStep() / this.totalSteps) * 100 + '%';
  });

  // Loop Arrays for Type Safety
  objetivos: UserProfile['objetivo'][] = ['perder_grasa', 'ganar_musculo', 'mantenerse', 'resistencia'];
  generos: UserProfile['genero'][] = ['masculino', 'femenino', 'otro'];
  niveles: UserProfile['nivel'][] = ['principiante', 'intermedio', 'avanzado'];
  diasSemana = [1, 2, 3, 4, 5, 6, 7];

  // Form State
  form = signal<UserProfile>({
    nombre: '',
    objetivo: 'perder_grasa',
    peso: 70,
    altura: 170,
    edad: 25,
    genero: 'masculino',
    nivel: 'principiante',
    dias_gym: 3,
    restricciones: '',
    preferencias: ''
  });

  // Step 4 Simulation
  loadingStatus = signal('Analizando tu perfil...');
  loadingProgress = signal(0);
  isGenerating = signal(false);

  nextStep() {
    if (this.currentStep() < this.totalSteps) {
      if (this.currentStep() === 3) {
        this.startGeneration();
      }
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  selectObjetivo(obj: UserProfile['objetivo']) {
    this.form.update(f => ({ ...f, objetivo: obj }));
  }

  selectNivel(n: UserProfile['nivel']) {
    this.form.update(f => ({ ...f, nivel: n }));
  }

  selectGenero(g: UserProfile['genero']) {
    this.form.update(f => ({ ...f, genero: g }));
  }

  updateEdad(delta: number) {
    this.form.update(f => ({ ...f, edad: Math.max(12, Math.min(100, f.edad + delta)) }));
  }

  updateWeight(val: any) {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    this.form.update(f => ({ ...f, peso: num }));
  }

  updateHeight(val: any) {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    this.form.update(f => ({ ...f, altura: num }));
  }

  updateDias(d: number) {
    this.form.update(f => ({ ...f, dias_gym: d }));
  }

  private startGeneration() {
    this.isGenerating.set(true);
    const statuses = [
      "Analizando tu perfil...",
      "Calculando tus calorías...",
      "Diseñando tu rutina...",
      "Optimizando tu nutrición...",
      "¡Listo! Tu plan está preparado 🎉"
    ];

    let count = 0;
    const interval = setInterval(() => {
      if (count < statuses.length - 1) {
        this.loadingStatus.set(statuses[count]);
        this.loadingProgress.update(p => p + 25);
        count++;
      } else {
        this.loadingStatus.set(statuses[count]);
        this.loadingProgress.set(100);
        clearInterval(interval);
        setTimeout(() => {
          this.profileService.setProfile(this.form());
          this.router.navigate(['/dashboard']);
        }, 1500);
      }
    }, 1000);
  }
}
