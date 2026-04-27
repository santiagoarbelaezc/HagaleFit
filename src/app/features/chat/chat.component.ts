import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FitAgentService } from '../../services/fit-agent.service';
import { ChatMessage } from '../../models/fit-plan.types';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-screen pb-20">

      <!-- Header -->
      <div class="px-6 pt-6 pb-4 border-b border-border">
        <h1 class="text-xl font-bold">FitAgent Chat</h1>
        <p class="text-xs text-ink-muted">Tu entrenador personal IA</p>
      </div>

      <!-- Mensajes -->
      <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4" #scrollContainer>

        @if (historial().length === 0) {
          <div class="text-center py-10 text-ink-muted text-sm">
            <p class="text-2xl mb-2">💬</p>
            <p>Pregúntame sobre tu rutina, ejercicios o nutrición.</p>
          </div>
        }

        @for (msg of historial(); track $index) {
          <div [class]="msg.rol === 'usuario' ? 'flex justify-end' : 'flex justify-start'">
            <div
              [class]="msg.rol === 'usuario'
                ? 'bg-primary text-white rounded-3xl rounded-br-sm px-4 py-3 max-w-[80%] text-sm'
                : 'bg-surface border border-border rounded-3xl rounded-bl-sm px-4 py-3 max-w-[80%] text-sm text-ink'"
            >
              {{ msg.texto }}
            </div>
          </div>
        }

        @if (cargando()) {
          <div class="flex justify-start">
            <div class="bg-surface border border-border rounded-3xl rounded-bl-sm px-4 py-3 text-sm text-ink-muted">
              Escribiendo...
            </div>
          </div>
        }

      </div>

      <!-- Input -->
      <div class="px-6 py-4 border-t border-border bg-background fixed bottom-16 left-0 right-0">
        <div class="flex items-center gap-3">
          <input
            type="text"
            [(ngModel)]="mensajeActual"
            (keyup.enter)="enviar()"
            placeholder="Pregunta algo sobre tu plan..."
            class="flex-1 bg-surface border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button
            (click)="enviar()"
            [disabled]="cargando() || !mensajeActual.trim()"
            class="bg-primary text-white w-11 h-11 rounded-2xl flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  `
})
export class ChatComponent {
  private fitAgentService = inject(FitAgentService);

  historial = signal<ChatMessage[]>([]);
  mensajeActual = '';
  cargando = signal(false);

  enviar() {
    const texto = this.mensajeActual.trim();
    if (!texto || this.cargando()) return;

    this.historial.update(h => [...h, { rol: 'usuario', texto }]);
    this.mensajeActual = '';
    this.cargando.set(true);

    this.fitAgentService.enviarMensajeChat(texto, this.historial()).subscribe({
      next: (respuesta) => {
        this.historial.update(h => [...h, { rol: 'agente', texto: respuesta }]);
        this.cargando.set(false);
      },
      error: () => {
        this.historial.update(h => [...h, { rol: 'agente', texto: 'Hubo un error, intenta de nuevo.' }]);
        this.cargando.set(false);
      }
    });
  }
}
