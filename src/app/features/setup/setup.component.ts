import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService, UserProfile } from '../../core/services/profile.service';
import { FitAgentService } from '../../services/fit-agent.service';
import { FitPlanRequest } from '../../models/fit-plan.types';
@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setup.component.html'
})
export class SetupComponent {
  private profileService = inject(ProfileService);
  private fitAgentService = inject(FitAgentService);
  private router = inject(Router);

  currentStep = signal(1);
  totalSteps = 3;

  progressWidth = computed(() => {
    return (this.currentStep() / this.totalSteps) * 100 + '%';
  });

  // Loop Arrays for Type Safety
  objetivos: UserProfile['objetivo'][] = ['perder_grasa', 'ganar_musculo', 'mantenerse', 'resistencia'];
  generos: UserProfile['genero'][] = ['masculino', 'femenino', 'otro'];
  niveles: UserProfile['nivel'][] = ['principiante', 'intermedio', 'avanzado'];
  diasSemanaNombres = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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
      if (this.currentStep() === 2) {
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

  updateNombre(name: string) {
    this.form.update(f => ({ ...f, nombre: name }));
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

  updateDiasGym(val: any) {
    const num = typeof val === 'string' ? parseInt(val, 10) : val;
    this.form.update(f => ({ ...f, dias_gym: num }));
  }


  updateRestricciones(val: string) {
    this.form.update(f => ({ ...f, restricciones: val }));
  }

  updatePreferencias(val: string) {
    this.form.update(f => ({ ...f, preferencias: val }));
  }

  private startGeneration() {
    this.isGenerating.set(true);
    const statuses = [
      "Analizando tu perfil...",
      "Conectando con la IA...",
      "Diseñando tu rutina...",
      "Optimizando tu nutrición...",
      "Casi listo..."
    ];

    let count = 0;
    const interval = setInterval(() => {
      if (count < statuses.length - 1) {
        this.loadingStatus.set(statuses[count]);
        this.loadingProgress.update(p => p + 20);
        count++;
      }
    }, 1500);

    const f = this.form();
    const request: FitPlanRequest = {
      objetivo: f.objetivo === 'perder_grasa' ? 'perder grasa' : 
                f.objetivo === 'ganar_musculo' ? 'ganar músculo' : 
                f.objetivo === 'mantenerse' ? 'mantenerse' : 'mejorar resistencia',
      peso: f.peso,
      altura: f.altura,
      edad: f.edad,
      genero: f.genero
    };

    this.fitAgentService.generarPlan(request).subscribe({
      next: (res) => {
        clearInterval(interval);
        this.loadingProgress.set(100);
        this.loadingStatus.set("¡Listo! Tu plan está preparado 🎉");
        this.fitAgentService.setLatestResponse(res);
        this.profileService.setProfile(f);
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err) => {
        clearInterval(interval);
        this.loadingStatus.set("Hubo un error de conexión.");
        setTimeout(() => this.isGenerating.set(false), 2000);
        console.error(err);
      }
    });
  }
}
