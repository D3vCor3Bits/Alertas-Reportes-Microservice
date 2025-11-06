import { header } from "./layout/header";
import { footer } from "./layout/footer";
import { DesactivacionSesionParams } from "../email.types";

export const desactivacionSesion = (params: DesactivacionSesionParams) => {
const formatDate = (date: string | Date) => {
    if (typeof date === "string") return date
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
    <title>Notificación de Desactivación de Sesión</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff;">
    
    ${header("Notificación de Desactivación de Sesión")}
    
    <div style="padding: 32px 40px;">
      
      <p style="font-size: 15px; color: #1f2937; margin: 0 0 6px 0; line-height: 1.5;">
        Estimado/a <strong>${params.nombreCompleto}</strong>,
      </p>

      <p style="font-size: 14px; color: #4b5563; margin: 0 0 28px 0; line-height: 1.6;">
        Le informamos que ${params.sessionNumber ? `la sesión <strong>#${params.sessionNumber}</strong>` : "una sesión"} de descripciones ha sido desactivada en el sistema.
      </p>

      ${
        params.sessionNumber || params.fecha
          ? `
      <table style="width: 100%; border-collapse: collapse; margin: 0 0 28px 0; border: 1px solid #e5e7eb;">
        <thead>
          <tr style="background-color: #fafafa; border-bottom: 2px solid #6b21a8;">
            <th colspan="2" style="padding: 12px 20px; text-align: left; color: #6b21a8; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">
              INFORMACIÓN DE LA SESIÓN
            </th>
          </tr>
        </thead>
        <tbody>
          ${
            params.sessionNumber
              ? `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 20px; color: #6b7280; font-size: 14px; width: 40%;">Número de sesión</td>
            <td style="padding: 12px 20px; color: #1f2937; font-size: 14px; font-weight: 500;">#${params.sessionNumber}</td>
          </tr>
          `
              : ""
          }
          ${
            params.fecha
              ? `
          <tr>
            <td style="padding: 12px 20px; color: #6b7280; font-size: 14px;">Fecha</td>
            <td style="padding: 12px 20px; color: #1f2937; font-size: 14px; font-weight: 500;">${formatDate(params.fecha)}</td>
          </tr>
          `
              : ""
          }
        </tbody>
      </table>
      `
          : ""
      }

      <div style="border-left: 3px solid #6b21a8; padding: 14px 18px; margin: 0 0 28px 0; background-color: #fafafa;">
        <p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.5;">
          <strong>Nota:</strong> Esta desactivación puede deberse a diversos motivos relacionados con la planificación terapéutica. Si tiene dudas o requiere información adicional, por favor contáctenos.
        </p>
      </div>

      <p style="font-size: 14px; color: #4b5563; margin: 0 0 20px 0; line-height: 1.6;">
        Su proceso terapéutico continúa siendo nuestra prioridad. Cualquier ajuste en las sesiones programadas será comunicado oportunamente.
      </p>

      <p style="font-size: 14px; color: #4b5563; margin: 0 0 32px 0; line-height: 1.6;">
        Para consultas o asistencia, estamos disponibles para atenderle.
      </p>

    </div>
    
    ${footer()}
    
  </body>
  </html>
`
}