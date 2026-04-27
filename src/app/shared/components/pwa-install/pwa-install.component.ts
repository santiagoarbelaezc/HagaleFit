import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pwa-install',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (showPrompt()) {
      <div class="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10 bg-black/40 backdrop-blur-sm animate-fade-in">
        <div class="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-fade-up">
          
          <div class="flex justify-center mb-6">
            <div class="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-4xl shadow-button">
              ⚡
            </div>
          </div>

          <h2 class="text-2xl font-bold text-ink text-center mb-2">Instala Hágale Fit</h2>
          <p class="text-sm text-ink-muted text-center mb-8 px-4">
            Añade esta aplicación a tu pantalla de inicio para disfrutar de la experiencia completa de entrenamiento IA.
          </p>

          <div class="space-y-6 bg-surface rounded-3xl p-6 border border-border">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-border">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
              </div>
              <p class="text-xs font-bold text-ink">1. Toca el botón 'Compartir' en la barra inferior.</p>
            </div>

            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-border">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </div>
              <p class="text-xs font-bold text-ink">2. Desliza hacia abajo y toca 'Añadir a pantalla de inicio'.</p>
            </div>
          </div>

          <button (click)="close()" class="w-full mt-8 py-4 bg-ink text-white rounded-2xl font-bold active:scale-95 transition-transform">
            Entendido
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class PwaInstallComponent implements OnInit {
  showPrompt = signal(false);

  ngOnInit() {
    this.detectIos();
  }

  detectIos() {
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;

    if (isIos && !isStandalone) {
      const hasSeenPrompt = localStorage.getItem('pwa_prompt_seen');
      if (!hasSeenPrompt) {
        this.showPrompt.set(true);
      }
    }
  }

  close() {
    this.showPrompt.set(false);
    localStorage.setItem('pwa_prompt_seen', 'true');
  }
}
