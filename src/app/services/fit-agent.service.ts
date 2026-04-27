import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { FitPlanRequest, FitPlanResponse, ChatMessage } from '../models/fit-plan.types';
import { ProfileService } from '../core/services/profile.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FitAgentService {

  // State to hold the latest response so dashboard can read it without fetching again
  private latestResponseSource = new BehaviorSubject<FitPlanResponse | null>(null);
  latestResponse$ = this.latestResponseSource.asObservable();

  constructor(
    private http: HttpClient,
    private profileService: ProfileService
  ) {}

  generarPlan(datos: FitPlanRequest): Observable<FitPlanResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('🚀 [Agente Plan] Enviando datos a n8n:', datos);
    
    return this.http.post<FitPlanResponse>(environment.planWebhookUrl, datos, { headers }).pipe(
      tap((response: FitPlanResponse) => console.log('✅ [Agente Plan] Respuesta recibida:', response))
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
    // Prioridad absoluta al objetivo
    let resumen = `OBJETIVO CRÍTICO: ${p.objetivo.toUpperCase()}\n`;
    resumen += `IMC ACTUAL: ${p.imc}\n\n`;

    resumen += `[ESTRATEGIA DE ENTRENAMIENTO]\n`;
    plan.rutina.forEach(dia => {
      const ejercicios = dia.ejercicios.map(e => e.ejercicio).join(', ');
      resumen += `DÍA ${dia.dia_numero} (${dia.nombre_sesion}): ${ejercicios}\n`;
    });

    if (plan.advertencias && plan.advertencias.length > 0) {
      resumen += `\n[LIMITACIONES]\n- ${plan.advertencias.join('\n- ')}\n`;
    }

    if (plan.recomendaciones && plan.recomendaciones.length > 0) {
      resumen += `\n[REGLAS DE ÉXITO PARA ${p.objetivo.toUpperCase()}]\n- ${plan.recomendaciones.join('\n- ')}`;
    }

    return resumen;
  }

  enviarMensajeChat(mensaje: string, historial: ChatMessage[]): Observable<string> {
    const plan = this.getLatestResponse();
    const profile = this.profileService.profile();
    const body = {
      sessionId: profile?.nombre || 'usuario-anonimo',
      nombre_usuario: profile?.nombre || 'Usuario',
      mensaje,
      historial: historial.map(m => ({ 
        role: m.rol === 'usuario' ? 'user' : 'assistant', 
        content: m.texto 
      })),
      contexto_plan: plan ? this.resumirPlan(plan) : 'Sin plan generado aún.'
    };

    console.log('🚀 [Agente Chat] Enviando mensaje a n8n:', body);

    return this.http.post<{ output: string }>(
      environment.chatWebhookUrl,
      body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(
      tap(res => console.log('✅ [Agente Chat] Respuesta recibida:', res)),
      map(res => res.output)
    );
  }
}
