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
    console.log('🚀 [FitAgent Back] Generando plan:', datos);
    
    return this.http.post<FitPlanResponse>(environment.planWebhookUrl, datos, { headers }).pipe(
      tap((response: FitPlanResponse) => {
        console.log('✅ [FitAgent Back] Plan recibido:', response);
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

  enviarMensajeChat(mensaje: string): Observable<string> {
    const plan = this.getLatestResponse();
    const profile = this.profileService.profile();
    
    this.agregarMensaje('usuario', mensaje);

    // Mapear al formato esperado por el backend NestJS (ChatDto)
    const body = {
      message: mensaje,
      userContext: {
        peso: profile?.peso,
        altura: profile?.altura,
        edad: profile?.edad,
        genero: profile?.genero,
        objetivo: plan?.perfil.objetivo || profile?.objetivo
      },
      history: this._historial().slice(-10).map(m => ({ 
        role: m.rol === 'usuario' ? 'user' : 'assistant', 
        content: m.texto 
      }))
    };

    console.log('🚀 [FitAgent Back] Chat request:', body);

    return this.http.post<{ response: string }>(
      environment.chatWebhookUrl,
      body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(
      tap(res => {
        console.log('✅ [FitAgent Back] Chat response:', res);
        this.agregarMensaje('agente', res.response);
      }),
      map(res => res.response)
    );
  }

  private agregarMensaje(rol: 'usuario' | 'agente', texto: string) {
    this._historial.update(h => [...h, { rol, texto }]);
  }
}
