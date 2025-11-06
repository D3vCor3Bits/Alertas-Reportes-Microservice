import { header } from "./layout/header";
import { footer } from "./layout/footer";
import { ActivacionSesionParams } from "../email.types";

export const activacionSesion = (params: ActivacionSesionParams) => {
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
    <title>Invitación a Sesión de Descripciones</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff;">
    
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 32px 40px;">
      <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 22px; font-weight: 600; letter-spacing: 0.3px;">
        ✨ Nueva Sesión de Descripciones Disponible
      </h1>
      <p style="color: #f3e8ff; margin: 0; font-size: 14px;">
        Una oportunidad para continuar con su progreso terapéutico
      </p>
    </div>
    
    <div style="padding: 32px 40px;">
      
      <p style="font-size: 15px; color: #1f2937; margin: 0 0 6px 0; line-height: 1.5;">
        Estimado/a <strong>${params.nombreCompleto}</strong>,
      </p>

      <p style="font-size: 14px; color: #4b5563; margin: 0 0 24px 0; line-height: 1.6;">
        Nos complace informarle que se ha activado una nueva sesión de descripciones diseñada para continuar fortaleciendo sus habilidades cognitivas y contribuir a su proceso de mejoramiento.
      </p>

      ${
        params.sessionNumber || params.fecha
          ? `
      <table style="width: 100%; border-collapse: collapse; margin: 0 0 28px 0; border: 1px solid #e5e7eb;">
        <thead>
          <tr style="background-color: #faf5ff; border-bottom: 2px solid #7c3aed;">
            <th colspan="2" style="padding: 12px 20px; text-align: left; color: #7c3aed; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">
              DETALLES DE LA SESIÓN
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
            <td style="padding: 12px 20px; color: #6b7280; font-size: 14px;">Fecha programada</td>
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

      <div style="background-color: #fafafa; border: 1px solid #e5e7eb; padding: 20px 24px; margin: 0 0 24px 0; border-radius: 4px;">
        <h3 style="margin: 0 0 14px 0; color: #1f2937; font-size: 15px; font-weight: 600;">
          Beneficios de esta sesión:
        </h3>
        <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
          <li style="margin-bottom: 8px;">Fortalecimiento de habilidades de memoria y recuerdo</li>
          <li style="margin-bottom: 8px;">Mejora en la coherencia y fluidez del lenguaje</li>
          <li style="margin-bottom: 8px;">Evaluación continua de su progreso terapéutico</li>
          <li>Retroalimentación personalizada para su desarrollo</li>
        </ul>
      </div>

      <p style="font-size: 14px; color: #4b5563; margin: 0 0 24px 0; line-height: 1.6;">
        Le invitamos a completar esta sesión a su conveniencia. Cada ejercicio está diseñado para ser accesible y contribuir significativamente a su proceso de mejoramiento.
      </p>

      <div style="text-align: center; margin: 0 0 28px 0;">
        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 15px; font-weight: 600; letter-spacing: 0.3px;">
          Iniciar Sesión de Descripciones
        </a>
      </div>

      <div style="border-left: 3px solid #7c3aed; padding: 14px 18px; margin: 0 0 24px 0; background-color: #fafafa;">
        <p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.5;">
          <strong>Nota:</strong> Esta sesión estará disponible para su realización. Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos.
        </p>
      </div>

      <p style="font-size: 14px; color: #4b5563; margin: 0; line-height: 1.6;">
        Agradecemos su compromiso con el proceso terapéutico y esperamos continuar acompañándole en su camino hacia el bienestar.
      </p>

    </div>
    
    ${footer()}
    
  </body>
  </html>
`
}