import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { FitPlanRequest, FitPlanResponse, ChatMessage } from '../models/fit-plan.types';
import { ProfileService } from '../core/services/profile.service';

@Injectable({ providedIn: 'root' })
export class FitAgentService {
  private readonly API_URL = '/webhook/e8b39dca-25cb-4cd4-8166-5b25ca0aa543';

  // State to hold the latest response so dashboard can read it without fetching again
  private latestResponseSource = new BehaviorSubject<FitPlanResponse | null>(null);
  latestResponse$ = this.latestResponseSource.asObservable();

  constructor(
    private http: HttpClient,
    private profileService: ProfileService
  ) {}

  generarPlan(datos: FitPlanRequest): Observable<FitPlanResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('🚀 Enviando datos a n8n:', datos);
    
    return this.http.post<FitPlanResponse>(this.API_URL, datos, { headers }).pipe(
      tap((response: FitPlanResponse) => console.log('✅ Respuesta original de n8n recibida:', response))
    );
  }

  setLatestResponse(response: FitPlanResponse) {
    this.latestResponseSource.next(response);
  }

  getLatestResponse(): FitPlanResponse | null {
    return this.latestResponseSource.getValue();
  }

  private resumirPlan(plan: FitPlanResponse): string {
    const sesiones = plan.rutina
      .map(d => `${d.nombre_sesion}: ${d.ejercicios.map(e => e.ejercicio).join(', ')}`)
      .join(' | ');

    return `
Perfil: ${plan.perfil.nivel}, IMC ${plan.perfil.imc}, objetivo ${plan.perfil.objetivo}, ${plan.perfil.dias_entrenamiento} días/semana.
Advertencias: ${plan.advertencias.length > 0 ? plan.advertencias.join(' | ') : 'ninguna'}.
Rutina: ${sesiones}.
Recomendaciones: ${plan.recomendaciones.join(' | ')}.
    `.trim();
  }

  enviarMensajeChat(mensaje: string, historial: ChatMessage[]): Observable<string> {
    const plan = this.getLatestResponse();
    const profile = this.profileService.profile();
    const body = {
      nombre_usuario: profile?.nombre || 'Usuario',
      mensaje,
      historial: historial.map(m => ({ rol: m.rol, texto: m.texto })),
      contexto_plan: plan ? this.resumirPlan(plan) : 'Sin plan generado aún.'
    };
    return this.http.post<{ output: string }>(
      '/webhook/d0a6902f-c441-4a39-acda-750ad4236f43',
      body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(map(res => res.output));
  }
}
