// templates/alerta-puntaje-bajo.email.ts
import { header } from "./layout/header";
import { footer } from "./layout/footer";
import { AlertaPuntajeBajoParams } from "../email.types";

export const alertaPuntajeBajoEmail = (params: AlertaPuntajeBajoParams) => `
  ${header('⚠️ Alerta: Puntaje Bajo en Descripción')}
  <div style="padding: 30px; line-height: 1.6; font-family: Arial, sans-serif;">
    <p style="font-size: 16px; color: #333;">Hola <strong>${params.usuarioNombre}</strong>,</p>
    
    <p style="font-size: 15px; color: #555;">
      Te informamos que se ha detectado un puntaje bajo en una de tus descripciones de imagen.
    </p>
    
    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <h3 style="margin: 0 0 10px 0; color: #856404;">Detalles de la Alerta:</h3>
      <ul style="margin: 10px 0; padding-left: 20px; color: #856404;">
        <li><strong>Puntaje obtenido:</strong> ${params.puntaje} / 100</li>
        <li><strong>Umbral mínimo:</strong> ${params.umbralMinimo} / 100</li>
        <li><strong>Fecha:</strong> ${params.fecha}</li>
      </ul>
    </div>
    
    <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 4px; border: 1px solid #dee2e6;">
      <h4 style="margin: 0 0 10px 0; color: #495057;">Descripción evaluada:</h4>
      <p style="margin: 0; color: #6c757d; font-style: italic;">"${params.descripcion}"</p>
    </div>
    
    <p style="font-size: 15px; color: #555;">
      Te recomendamos revisar esta descripción y considerar mejorarla para obtener un mejor puntaje en futuras evaluaciones.
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
      <p style="font-size: 14px; color: #888; margin: 0;">
        Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.
      </p>
    </div>
  </div>
  ${footer()}
`;
