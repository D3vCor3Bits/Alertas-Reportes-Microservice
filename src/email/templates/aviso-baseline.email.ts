import { header } from "./layout/header";
import { footer } from "./layout/footer";
import { BaselineAvisoParams } from "../email.types";

export const avisoBaseline = (params: BaselineAvisoParams) => {
  const toPercent = (value: number) => Math.round(value * 100)
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-CO", {
      timeZone: 'America/Bogota',
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Sesión Baseline</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff;">
    
    ${header("Reporte de Sesión Baseline")}
    
    <div style="padding: 32px 40px;">
      
      <p style="font-size: 15px; color: #1f2937; margin: 0 0 6px 0; line-height: 1.5;">
        Estimado/a Dr(a). <strong>${params.nombreDoctor}</strong>,
      </p>

      <p style="font-size: 14px; color: #4b5563; margin: 0 0 28px 0; line-height: 1.6;">
        Le informamos que se ha completado la <strong>sesión baseline</strong> (primera evaluación) del paciente <strong>${params.nombrePaciente}</strong>. A continuación, encontrará el resumen detallado de los resultados obtenidos. Tenga en cuenta que el resultado total es la ponderación completa posterior al análsis mediante Procesamiento de Lenguaje Natural (NLP).
      </p>

      <table style="width: 100%; border-collapse: collapse; margin: 0 0 28px 0; border: 1px solid #e5e7eb;">
        <thead>
          <tr style="background-color: #faf5ff; border-bottom: 2px solid #6b21a8;">
            <th colspan="2" style="padding: 12px 20px; text-align: left; color: #6b21a8; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">
              RESULTADOS DE LA EVALUACIÓN
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 20px; color: #6b7280; font-size: 14px; width: 50%;">Paciente</td>
            <td style="padding: 12px 20px; color: #1f2937; font-size: 14px; font-weight: 500;">${params.nombrePaciente}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 20px; color: #6b7280; font-size: 14px;">Fecha</td>
            <td style="padding: 12px 20px; color: #1f2937; font-size: 14px; font-weight: 500;">${formatDate(params.fecha)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb; background-color: #fafafa;">
            <td style="padding: 12px 20px; color: #6b7280; font-size: 14px;">Recall (Recuerdo)</td>
            <td style="padding: 12px 20px; color: #1f2937; font-size: 14px; font-weight: 600;">${toPercent(params.sessionRecall)}%</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 20px; color: #6b7280; font-size: 14px;">Comisión</td>
            <td style="padding: 12px 20px; color: #1f2937; font-size: 14px; font-weight: 600;">${toPercent(params.sessionComision)}%</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb; background-color: #fafafa;">
            <td style="padding: 12px 20px; color: #6b7280; font-size: 14px;">Omisión</td>
            <td style="padding: 12px 20px; color: #1f2937; font-size: 14px; font-weight: 600;">${toPercent(params.sessionOmision)}%</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 20px; color: #6b7280; font-size: 14px;">Coherencia</td>
            <td style="padding: 12px 20px; color: #1f2937; font-size: 14px; font-weight: 600;">${toPercent(params.sessionCoherencia)}%</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb; background-color: #fafafa;">
            <td style="padding: 12px 20px; color: #6b7280; font-size: 14px;">Fluidez</td>
            <td style="padding: 12px 20px; color: #1f2937; font-size: 14px; font-weight: 600;">${toPercent(params.sessionFluidez)}%</td>
          </tr>
          <tr style="background-color: #faf5ff; border-top: 2px solid #6b21a8;">
            <td style="padding: 14px 20px; color: #6b21a8; font-size: 14px; font-weight: 600;">Puntaje Total</td>
            <td style="padding: 14px 20px; color: #6b21a8; font-size: 16px; font-weight: 700;">${toPercent(params.sessionTotal)}%</td>
          </tr>
        </tbody>
      </table>

      <div style="border-left: 3px solid #6b21a8; padding: 14px 18px; margin: 0 0 28px 0; background-color: #fafafa;">
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #374151; line-height: 1.5;">
          <strong>Nota:</strong> Esta sesión baseline establece los valores de referencia iniciales del paciente y servirá como punto de comparación para futuras evaluaciones.
        </p>
        <p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.5;">
          <strong>Interpretación de porcentajes:</strong> Los valores se expresan en una escala de 0 a 100, donde 100 representa el nivel máximo de la variable evaluada y 0 indica ausencia o nivel mínimo de la misma.
        </p>
      </div>

      <p style="font-size: 14px; color: #4b5563; margin: 0 0 20px 0; line-height: 1.6;">
        Estos resultados baseline proporcionan una línea base para el seguimiento del progreso del paciente. Se recomienda revisar los valores obtenidos y establecer objetivos terapéuticos apropiados.
      </p>

      <p style="font-size: 14px; color: #4b5563; margin: 0 0 32px 0; line-height: 1.6;">
        Para acceder al informe completo o programar una sesión de seguimiento, por favor contáctenos.
      </p>

    </div>
    
    ${footer()}
    
  </body>
  </html>
`
}