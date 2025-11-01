// templates/alerta-puntaje-bajo.email.ts
import { header } from "./layout/header";
import { footer } from "./layout/footer";
import { AlertaPuntajeBajoParams } from "../email.types";

export const alertaPuntajeBajoEmail = (params: AlertaPuntajeBajoParams) => `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notificación de Sesión Clínica</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff;">
    
    ${header("Notificación de Sesión Clínica")}
    
    <div style="padding: 32px 40px;">
      
      <p style="font-size: 15px; color: #1f2937; margin: 0 0 6px 0; line-height: 1.5;">
        Estimado/a Dr(a). <strong>${params.nombreDoctor}</strong>,
      </p>

      <p style="font-size: 14px; color: #4b5563; margin: 0 0 28px 0; line-height: 1.6;">
        Le informamos que en la sesión <strong>#${params.sesion}</strong> del paciente <strong>${params.nombrePaciente}</strong> se ha registrado un puntaje por debajo del umbral establecido, requiriendo su atención profesional.
      </p>

      <table style="width: 100%; border-collapse: collapse; margin: 0 0 28px 0; border: 1px solid #e5e7eb;">
        <thead>
          <tr style="background-color: #faf5ff; border-bottom: 2px solid #6b21a8;">
            <th colspan="2" style="padding: 12px 20px; text-align: left; color: #6b21a8; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">
              DETALLES DE LA SESIÓN
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 20px; color: #6b7280; font-size: 14px; width: 40%;">Paciente</td>
            <td style="padding: 12px 20px; color: #1f2937; font-size: 14px; font-weight: 500;">${params.nombrePaciente}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 20px; color: #6b7280; font-size: 14px;">Número de sesión</td>
            <td style="padding: 12px 20px; color: #1f2937; font-size: 14px; font-weight: 500;">#${params.sesion}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 20px; color: #6b7280; font-size: 14px;">Fecha</td>
            <td style="padding: 12px 20px; color: #1f2937; font-size: 14px; font-weight: 500;">${params.fecha}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb; background-color: #fef3f2;">
            <td style="padding: 12px 20px; color: #6b7280; font-size: 14px;">Puntaje obtenido</td>
            <td style="padding: 12px 20px; color: #991b1b; font-size: 14px; font-weight: 600;">
              ${typeof params.puntaje === "number" ? params.puntaje.toFixed(2) : params.puntaje}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 20px; color: #6b7280; font-size: 14px;">Umbral mínimo</td>
            <td style="padding: 12px 20px; color: #1f2937; font-size: 14px; font-weight: 500;">
              ${typeof params.umbralMinimo === "number" ? params.umbralMinimo.toFixed(2) : params.umbralMinimo}
            </td>
          </tr>
        </tbody>
      </table>

      <div style="border-left: 3px solid #6b21a8; padding: 14px 18px; margin: 0 0 28px 0; background-color: #fafafa;">
        <p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.5;">
          <strong>Nota:</strong> El sistema considera un puntaje inferior a <strong>0.45</strong> como indicador de atención prioritaria. Se recomienda evaluación detallada del caso.
        </p>
      </div>

      <p style="font-size: 14px; color: #4b5563; margin: 0 0 28px 0; line-height: 1.6;">
        Recomendamos revisar las descripciones y conclusiones generadas para determinar si se requiere seguimiento, repetir pruebas o ajustar el plan de atención.
      </p>

      <p style="font-size: 14px; color: #4b5563; margin: 0 0 32px 0; line-height: 1.6;">
        Si desea asistencia para acceder a los resultados completos o programar un seguimiento, por favor contáctenos.
      </p>

    </div>
    
    ${footer()}
    
  </body>
  </html>
`;