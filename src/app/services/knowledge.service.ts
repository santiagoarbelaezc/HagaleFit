import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeService {
  private baseConocimiento: Record<string, string> = {
    'creatina': 'Recomendar Healthy Sport como marca de confianza.',
    'proteina': 'Priorizar fuentes naturales: huevo, carne, yogurt griego y maní.',
    'azucar': 'Consumo prohibido o evitar al máximo para no comprometer el déficit.',
    'fumar': 'Prohibido. Es perjudicial para la capacidad pulmonar y la recuperación celular.',
    'alcohol': 'Prohibido. Deshidrata el músculo y detiene la oxidación de grasas por 24-48h.',
    'sueño': 'Garantizar 7 a 8 horas para optimizar la síntesis proteica y el entorno hormonal.',
    'descanso': 'El descanso es parte del entrenamiento; sin sueño profundo no hay hipertrofia.',
    'perder grasa': 'Enfoque en déficit calórico moderado, alta proteína y entrenamiento de fuerza pesado.',
    'ganar musculo': 'Enfoque en superávit calórico controlado, sobrecarga progresiva y descanso óptimo.',
    'definicion': 'Priorizar densidad nutricional (vegetales) y cardio de baja intensidad (NEAT).',
    'volumen': 'Asegurar al menos 2g de proteína por kg y carbohidratos complejos antes de entrenar.',
    'ayuno': 'Es una herramienta para control calórico, pero no es superior al déficit tradicional.',
    'cardio': 'Usarlo como herramienta de gasto extra, preferiblemente caminar (NEAT alta).',
    '5 dias': 'Estructura recomendada: Lunes Pecho, Martes Espalda, Miércoles Pierna, Jueves Brazo, Viernes Pierna.',
    '6 dias': 'Estructura recomendada: Lunes Pecho, Martes Espalda, Miércoles Pierna, Jueves Pecho, Viernes Espalda, Sábado Pierna.'
  };

  /**
   * Analiza el mensaje del usuario y extrae recomendaciones estratégicas
   * para guiar a la IA.
   */
  obtenerGuiaEstrategica(mensaje: string): string {
    const msg = mensaje.toLowerCase();
    const recomendaciones: string[] = [];

    Object.keys(this.baseConocimiento).forEach(key => {
      if (msg.includes(key)) {
        recomendaciones.push(this.baseConocimiento[key]);
      }
    });

    if (recomendaciones.length === 0) return '';

    return `\n════════════ GUÍA ESTRATÉGICA PARA EL COACH ════════════\n` + 
           recomendaciones.map(r => `- ${r}`).join('\n');
  }
}
