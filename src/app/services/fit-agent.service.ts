import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { FitPlanRequest, FitPlanResponse, ChatMessage } from '../models/fit-plan.types';
import { ProfileService } from '../core/services/profile.service';
import { KnowledgeService } from './knowledge.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FitAgentService {
  private http = inject(HttpClient);
  private profileService = inject(ProfileService);
  private knowledgeService = inject(KnowledgeService);

  private latestResponseSource = new BehaviorSubject<FitPlanResponse | null>(null);
  latestResponse$ = this.latestResponseSource.asObservable();

  // Historial persistente
  private _historial = signal<ChatMessage[]>([]);
  historial = this._historial.asReadonly();

  generarPlan(datos: FitPlanRequest): Observable<FitPlanResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('🚀 [Agente Plan] Enviando datos a n8n:', datos);
    
    return this.http.post<FitPlanResponse>(environment.planWebhookUrl, datos, { headers }).pipe(
      tap((response: FitPlanResponse) => {
        console.log('✅ [Agente Plan] Respuesta recibida:', response);
        if (response) {
          this.setLatestResponse(response);
        }
      })
    );
  }

  setLatestResponse(response: FitPlanResponse) {
    this.latestResponseSource.next(response);
  }

  getLatestResponse(): FitPlanResponse | null {
    return this.latestResponseSource.getValue();
  }

  private resumirPlan(plan: FitPlanResponse): string {
    const p = plan.perfil;
    const profile = this.profileService.profile();
    
    let resumen = `DATOS DEL USUARIO:\n`;
    resumen += `Nombre: ${profile?.nombre || 'Santiago'}\n`;
    resumen += `Peso: ${profile?.peso} kg\n`;
    resumen += `Altura: ${profile?.altura} cm\n`;
    resumen += `IMC: ${p.imc}\n`;
    resumen += `Objetivo: ${p.objetivo.toUpperCase()}\n\n`;

    resumen += `RUTINA ACTUAL:\n`;
    plan.rutina?.forEach(dia => {
      const ejercicios = dia.ejercicios.map(e => e.ejercicio).join(', ');
      resumen += `- ${dia.nombre_sesion}: ${ejercicios}\n`;
    });

    if (plan.advertencias && plan.advertencias.length > 0) {
      resumen += `\n[LIMITACIONES]\n- ${plan.advertencias.join('\n- ')}\n`;
    }

    if (plan.recomendaciones && plan.recomendaciones.length > 0) {
      resumen += `\n[REGLAS DE ÉXITO PARA ${p.objetivo.toUpperCase()}]\n- ${plan.recomendaciones.join('\n- ')}`;
    }

    return resumen;
  }

  enviarMensajeChat(mensaje: string): Observable<string> {
    const plan = this.getLatestResponse();
    const profile = this.profileService.profile();
    
    this.agregarMensaje('usuario', mensaje);

    const guiaEstrategica = this.knowledgeService.obtenerGuiaEstrategica(mensaje);
    const contextoConGuia = (plan ? this.resumirPlan(plan) : 'Sin plan generado aún.') + guiaEstrategica;

    const body = {
      sessionId: profile?.nombre || 'usuario-anonimo',
      nombre_usuario: profile?.nombre || 'Usuario',
      mensaje,
      // Enviamos el perfil estructurado para que n8n lo procese con un nodo Code
      perfil_usuario: {
        nombre: profile?.nombre,
        peso: profile?.peso,
        altura: profile?.altura,
        imc: plan?.perfil.imc,
        objetivo: plan?.perfil.objetivo
      },
      // Limitamos el historial a los últimos 10 mensajes para evitar saturar el límite de Groq
      historial: this._historial().slice(-10).map(m => ({ 
        role: m.rol === 'usuario' ? 'user' : 'assistant', 
        content: m.texto 
      })),
      contexto_plan: contextoConGuia
    };

    console.log('🚀 [Agente Chat] Enviando mensaje a n8n:', body);

    return this.http.post<{ output: string }>(
      environment.chatWebhookUrl,
      body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(
      tap(res => {
        console.log('✅ [Agente Chat] Respuesta recibida:', res);
        this.agregarMensaje('agente', res.output);
      }),
      map(res => res.output)
    );
  }

  private agregarMensaje(rol: 'usuario' | 'agente', texto: string) {
    this._historial.update(h => [...h, { rol, texto }]);
  }
}
