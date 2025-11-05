import { header } from './layout/header';
import { footer } from './layout/footer';
import { InvitacionUsuarioParams } from '../email.types';

export const invitacionUsuario = (params: InvitacionUsuarioParams) => {
  const rol = params.rol.toLowerCase();
  const nombreCompleto  = params.nombreCompleto;
  const baseUrl = 'https://devcorebits.com/registro';

  const link = `${baseUrl}?token=${params.token}`;

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitación de Acceso</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff;">

    ${header('Invitación para acceder a la plataforma')}

    <div style="padding: 32px 40px;">

      <p style="font-size: 15px; color: #1f2937; margin: 0 0 10px 0; line-height: 1.5;">
        Hola, ${nombreCompleto}
      </p>

      <p style="font-size: 14px; color: #4b5563; margin: 0 0 24px 0; line-height: 1.6;">
        Has sido invitado a unirte a nuestra plataforma como <strong>${rol}</strong>.
        Por favor, completa tu registro haciendo clic en el siguiente botón:
      </p>

      <div style="text-align: center; margin-bottom: 32px;">
        <a href="${link}"
           style="display: inline-block; background-color: #6b21a8; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 12px 28px; border-radius: 8px;">
           Completar Registro
        </a>
      </div>

      <p style="font-size: 13px; color: #6b7280; margin: 0 0 24px 0; line-height: 1.6;">
        Si el botón no funciona, también puedes copiar y pegar el siguiente enlace en tu navegador:
      </p>

      <div style="word-break: break-all; font-size: 13px; color: #4b5563; background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 12px 16px; border-radius: 6px; margin-bottom: 28px;">
        ${link}
      </div>

      <div style="border-left: 3px solid #6b21a8; padding: 14px 18px; margin: 0 0 28px 0; background-color: #fafafa;">
        <p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.5;">
          <strong>Nota:</strong> Esta invitación es válida solo una vez. Una vez completado el registro, podrás acceder con tus nuevas credenciales.
        </p>
      </div>

      <p style="font-size: 14px; color: #4b5563; margin: 0 0 20px 0; line-height: 1.6;">
        Si no esperabas esta invitación, puedes ignorar este mensaje.
      </p>

    </div>

    ${footer()}

  </body>
  </html>
  `;
};
