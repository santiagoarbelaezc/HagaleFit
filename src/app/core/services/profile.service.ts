import { Injectable, signal, computed } from '@angular/core';

export interface UserProfile {
  nombre: string;
  objetivo: 'perder_grasa' | 'ganar_musculo' | 'mantenerse' | 'resistencia';
  peso: number;         // kg
  altura: number;       // cm
  edad: number;
  genero: 'masculino' | 'femenino' | 'otro';
  nivel: 'principiante' | 'intermedio' | 'avanzado';
  dias_gym: number;     // 1-7
  restricciones: string;
  preferencias: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private _profile = signal<UserProfile | null>(null);
  
  profile = this._profile.asReadonly();
  
  isSetupComplete = computed(() => this._profile() !== null);

  setProfile(profile: UserProfile) {
    this._profile.set(profile);
    // Persist in localStorage for PWA experience
    localStorage.setItem('hagalefit_profile', JSON.stringify(profile));
  }

  loadProfile() {
    const saved = localStorage.getItem('hagalefit_profile');
    if (saved) {
      this._profile.set(JSON.parse(saved));
    }
  }

  clearProfile() {
    this._profile.set(null);
    localStorage.removeItem('hagalefit_profile');
  }
}
