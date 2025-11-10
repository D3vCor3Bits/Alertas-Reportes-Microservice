import { header } from "./layout/header";
import { footer } from "./layout/footer";
import { RecordatorioSesionesParams } from "../email.types";


export const recordatorio = (params: RecordatorioSesionesParams) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recordatorio de Sesión Pendiente</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff;">
      
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 32px 40px;">
        <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 22px; font-weight: 600; letter-spacing: 0.3px;">
          🔔 Recordatorio: Sesión en Progreso
        </h1>
        <p style="color: #f3e8ff; margin: 0; font-size: 14px;">
          Tu progreso es importante para nosotros
        </p>
      </div>
      
      <div style="padding: 32px 40px;">
        
        <p style="font-size: 15px; color: #1f2937; margin: 0 0 6px 0; line-height: 1.5;">
          Hola <strong>${params.nombreUsuario}</strong>,
        </p>

        <p style="font-size: 14px; color: #4b5563; margin: 0 0 24px 0; line-height: 1.6;">
          Notamos que ${params.sesionesActivas === 1 ? "tienes una sesión activa" : `tienes <strong>${params.sesionesActivas} sesiones activas</strong>`} que ${params.sesionesActivas === 1 ? "no ha sido completada" : "no han sido completadas"}. Queremos recordarte que continuar con ${params.sesionesActivas === 1 ? "tu sesión" : "tus sesiones"} es fundamental para tu proceso de mejoramiento.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 0 0 28px 0; border: 1px solid #e5e7eb;">
          <thead>
            <tr style="background-color: #faf5ff; border-bottom: 2px solid #7c3aed;">
              <th colspan="2" style="padding: 12px 20px; text-align: left; color: #7c3aed; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">
                INFORMACIÓN DE ACTIVIDAD
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 20px; color: #6b7280; font-size: 14px; width: 50%;">Sesiones activas</td>
              <td style="padding: 12px 20px; color: #1f2937; font-size: 14px; font-weight: 600;">${params.sesionesActivas}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb; background-color: #fef3f2;">
              <td style="padding: 12px 20px; color: #6b7280; font-size: 14px;">Tiempo de inactividad</td>
              <td style="padding: 12px 20px; color: #991b1b; font-size: 14px; font-weight: 600;">${params.horasInactivo} horas</td>
            </tr>
            ${
              params.ultimoLogin
                ? `
            <tr>
              <td style="padding: 12px 20px; color: #6b7280; font-size: 14px;">Último acceso</td>
              <td style="padding: 12px 20px; color: #1f2937; font-size: 14px; font-weight: 500;">${params.ultimoLogin}</td>
            </tr>
            `
                : ""
            }
          </tbody>
        </table>

        <div style="background-color: #fafafa; border: 1px solid #e5e7eb; padding: 20px 24px; margin: 0 0 24px 0; border-radius: 4px;">
          <h3 style="margin: 0 0 14px 0; color: #1f2937; font-size: 15px; font-weight: 600;">
            ¿Por qué es importante continuar?
          </h3>
          <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
            <li style="margin-bottom: 8px;">La continuidad en las sesiones maximiza los beneficios terapéuticos</li>
            <li style="margin-bottom: 8px;">Cada ejercicio está diseñado para fortalecer tus habilidades cognitivas</li>
            <li style="margin-bottom: 8px;">Tu progreso se registra y evalúa para personalizar tu tratamiento</li>
            <li>Completar las sesiones a tiempo ayuda a mantener el ritmo de mejoramiento</li>
          </ul>
        </div>

        <div style="border-left: 3px solid #7c3aed; padding: 14px 18px; margin: 0 0 24px 0; background-color: #fafafa;">
          <p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.5;">
            <strong>Recuerda:</strong> Puedes completar ${params.sesionesActivas === 1 ? "tu sesión" : "tus sesiones"} a tu propio ritmo. Si tienes alguna dificultad o pregunta, nuestro equipo está disponible para ayudarte.
          </p>
        </div>

        <p style="font-size: 14px; color: #4b5563; margin: 0; line-height: 1.6;">
          Estamos aquí para apoyarte en cada paso de tu proceso. ¡Ánimo, tu esfuerzo vale la pena!
        </p>

      </div>
      
      ${footer()}
      
    </body>
    </html>
  `;
}