import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FitAgentService } from '../../services/fit-agent.service';
import { ChatMessage } from '../../models/fit-plan.types';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-screen pb-20 bg-[#F9FAFB]">

      <!-- Header Premium -->
      <div class="px-6 pt-8 pb-6 bg-white border-b border-border shadow-sm">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
              🤖
            </div>
            <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-4 border-white rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 class="text-xl font-bold text-ink">FitAgent Master</h1>
            <div class="flex items-center space-x-1">
              <span class="text-[10px] font-bold text-success uppercase tracking-widest">En línea</span>
              <span class="text-[10px] text-ink-muted">• Inteligencia Artificial</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensajes -->
      <div class="flex-1 overflow-y-auto px-6 py-6 space-y-6" #scrollContainer>

        @if (historial().length === 0) {
          <div class="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div class="w-20 h-20 bg-surface rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">
              💬
            </div>
            <h2 class="text-lg font-bold text-ink mb-2">¿En qué puedo ayudarte hoy?</h2>
            <p class="text-sm text-ink-muted max-w-[240px]">
              Pregúntame sobre técnica, nutrición o ajustemos tu plan en tiempo real.
            </p>
          </div>
        }

        @for (msg of historial(); track $index) {
          <div 
            [class]="msg.rol === 'usuario' ? 'flex justify-end' : 'flex justify-start'"
            class="animate-fade-up"
          >
            <div
              [class]="msg.rol === 'usuario'
                ? 'bg-primary text-white rounded-2xl rounded-tr-none px-5 py-3.5 shadow-button max-w-[85%]'
                : 'bg-white border border-border rounded-2xl rounded-tl-none px-5 py-3.5 shadow-sm text-ink max-w-[85%]'"
            >
              <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ msg.texto }}</p>
              <span class="text-[9px] mt-2 block opacity-50 font-bold uppercase tracking-widest">
                {{ msg.rol === 'usuario' ? 'Tú' : 'FitAgent' }}
              </span>
            </div>
          </div>
        }

        @if (cargando()) {
          <div class="flex justify-start animate-fade-in">
            <div class="bg-white border border-border rounded-2xl rounded-tl-none px-5 py-3.5 shadow-sm">
              <div class="flex space-x-1.5">
                <div class="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
              </div>
            </div>
          </div>
        }

      </div>

      <!-- Input Area -->
      <div class="px-6 py-4 bg-white/80 backdrop-blur-md border-t border-border fixed bottom-16 left-0 right-0 z-10">
        <div class="flex items-center gap-3 bg-surface border border-border rounded-2xl p-1 shadow-sm focus-within:border-primary transition-colors">
          <input
            type="text"
            [(ngModel)]="mensajeActual"
            (keyup.enter)="enviar()"
            placeholder="Escribe tu mensaje..."
            class="flex-1 bg-transparent border-none px-4 py-3 text-sm outline-none placeholder:text-ink-muted"
          />
          <button
            (click)="enviar()"
            [disabled]="cargando() || !mensajeActual.trim()"
            class="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-30 disabled:grayscale active:scale-95 transition-all shadow-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
  `]
})
export class ChatComponent {
  private fitAgentService = inject(FitAgentService);

  historial = this.fitAgentService.historial;
  mensajeActual = '';
  cargando = signal(false);

  enviar() {
    const texto = this.mensajeActual.trim();
    if (!texto || this.cargando()) return;

    this.mensajeActual = '';
    this.cargando.set(true);

    this.fitAgentService.enviarMensajeChat(texto).subscribe({
      next: () => {
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      }
    });
  }
}
