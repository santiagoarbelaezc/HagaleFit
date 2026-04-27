export interface FitPlanRequest {
  objetivo: string;
  peso: number;
  altura: number;
  edad: number;
  genero: string;
}

export interface FitPlanResponse {
  perfil: {
    imc: number;
    nivel: string;
    dias_entrenamiento: number;
    objetivo: string;
  };
  advertencias: string[];
  rutina: RoutineDay[];
  recomendaciones: string[];
  mensaje_motivacional: string;
}

export interface RoutineDay {
  dia_numero: number;
  nombre_sesion: string;
  ejercicios: Exercise[];
  notas_del_dia: string;
}

export interface Exercise {
  orden: number;
  ejercicio: string;
  series: number;
  reps: string;
  descanso_seg: number;
  nota_tecnica: string;
}

export interface ChatMessage {
  rol: 'usuario' | 'agente';
  texto: string;
}
