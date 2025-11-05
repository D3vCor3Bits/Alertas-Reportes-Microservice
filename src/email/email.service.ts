// email.service.ts
import { HttpStatus, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { Resend } from "resend";
import { envs } from "src/config";
import { SendEmailParams, EMAIL } from "./email.types";
import { alertaPuntajeBajoEmail } from "./templates/alerta-puntaje-bajo.email";
import { RpcException } from "@nestjs/microservices";
import { avisoBaseline } from "./templates/aviso-baseline.email";
import { invitacionUsuario } from "./templates/invitacion-usuario.email";

@Injectable()
export class EmailService {
  private readonly resendClient: Resend;
  private readonly logger = new Logger(EmailService.name);
  
  constructor() {
    this.resendClient = new Resend(envs.resendApiKey);
  }

  /**
   * Send email
   * @param type
   * @param email
   * @param params
   */

  async sendEmail(emailParams: SendEmailParams){
    try {
      const { html, subject } = this.getEmailContent(emailParams);
      const toEmail = this.getRecipientEmail(emailParams);

      this.logger.log(`Enviando email a: ${toEmail}`);

      const { data, error } = await this.resendClient.emails.send({
        from: `${envs.emailFrom} <${envs.emailFromAddress}>`,
        to: [toEmail],
        subject,
        html,
      });

      if (error) {
        this.logger.error(`Error al enviar email: ${error.message}`);
        throw new InternalServerErrorException(
          `Error al enviar el email: ${error.message}`
        );
      }

      this.logger.log(`Email enviado exitosamente. ID: ${data?.id}`);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: "Error al procesar el envío del email",
      });
    }
  }

  private getEmailContent(
    emailParams: SendEmailParams
  ): { html: string; subject: string } {
    switch (emailParams.type) {
      case EMAIL.ALERTA_PUNTAJE_BAJO:
        return {
          html: alertaPuntajeBajoEmail(emailParams.params),
          subject: `Alerta: Puntaje Bajo Detectado en la descripción del paciente ${emailParams.params.nombrePaciente}`,
        };
      case EMAIL.AVISO_BASELINE:
        return {
          html: avisoBaseline(emailParams.params),
          subject: `Baseline: El paciente ${emailParams.params.nombrePaciente} ha generado su primera sesión de decripciones`
        };
      case EMAIL.INVITACION_USUARIO:
        return {
          html: invitacionUsuario(emailParams.params),
          subject: `Invitación para unirse a la plataforma como ${emailParams.params.rol}`
        }; 
      default:
        throw new InternalServerErrorException("Tipo de email no reconocido");
    }
  }

  private getRecipientEmail(emailParams: SendEmailParams): string {
    switch (emailParams.type) {
      case EMAIL.ALERTA_PUNTAJE_BAJO:
        return emailParams.params.usuarioEmail;
      case EMAIL.AVISO_BASELINE:
        return emailParams.params.usuarioEmail;
      case EMAIL.INVITACION_USUARIO:
        return emailParams.params.usuarioEmail;
      default:
        throw new InternalServerErrorException(
          "No se pudo determinar el destinatario del email"
        );
    }
  }
}
