// templates/alerta-puntaje-bajo.email.ts
import { header } from "./layout/header";
import { footer } from "./layout/footer";
import { AlertaPuntajeBajoParams } from "../email.types";

export const alertaPuntajeBajoEmail = (params: AlertaPuntajeBajoParams) => `
  ${header('⚠️ Alerta: Puntaje Bajo en Sesión')}
  <div style="padding: 30px; line-height: 1.6; font-family: Arial, sans-serif;">
    <p style="font-size: 16px; color: #333;">Estimado/a Dr(a). <strong>${params.nombreDoctor}</strong>,</p>

    <p style="font-size: 15px; color: #555;">
      Le informamos que en la sesión <strong>#${params.sesion}</strong> el paciente <strong>${params.nombrePaciente}</strong> obtuvo un puntaje inferior al umbral esperado.
    </p>

    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <h3 style="margin: 0 0 10px 0; color: #856404;">Detalles de la Alerta:</h3>
      <ul style="margin: 10px 0; padding-left: 20px; color: #856404;">
        <li><strong>Puntaje obtenido:</strong> ${typeof params.puntaje === 'number' ? params.puntaje.toFixed(2) : params.puntaje} (escala 0.00–1.00)</li>
        <li><strong>Umbral mínimo configurado:</strong> ${typeof params.umbralMinimo === 'number' ? params.umbralMinimo.toFixed(2) : params.umbralMinimo}</li>
        <li><strong>Fecha:</strong> ${params.fecha}</li>
      </ul>
    </div>

    <p style="font-size: 14px; color: #444;">
      Nota: en este sistema, se considera "puntaje bajo" cuando el puntaje es menor a <strong>0.45</strong>. Por favor, tenga en cuenta este criterio al revisar la sesión.
    </p>

    <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 4px; border: 1px solid #dee2e6;">
      <h4 style="margin: 0 0 10px 0; color: #495057;">Resumen de la sesión:</h4>
      <p style="margin: 0; color: #6c757d; font-style: italic;">Paciente: ${params.nombrePaciente} — Sesión #${params.sesion}</p>
    </div>

    <p style="font-size: 15px; color: #555;">
      Recomendamos revisar las descripciones y conclusiones generadas para determinar si se requiere seguimiento, repetir pruebas o ajustar el plan de atención.
    </p>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
      <p style="font-size: 14px; color: #888; margin: 0;">
        Si desea asistencia para acceder a los resultados completos o programar un seguimiento, por favor contáctenos.
      </p>
    </div>
  </div>
  ${footer()}
`;
