import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateAlertasReporteDto } from './dto/create-alertas-reporte.dto';
import { UpdateAlertasReporteDto } from './dto/update-alertas-reporte.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { PuntajeDto } from './dto';
import { EmailService } from 'src/email/email.service';
import { EMAIL } from 'src/email/email.types';

@Injectable()
export class AlertasReportesService {
  private readonly logger = new Logger(AlertasReportesService.name);

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly emailService: EmailService
  ) {}

  async generarAlertasPuntaje(puntajeDto: PuntajeDto) {
    this.logger.log(
      `Evaluando puntaje: ${puntajeDto.puntaje} vs umbral: ${puntajeDto.umbralMinimo}`
    );

    // Si el puntaje es menor al umbral, enviar alerta
    if (puntajeDto.puntaje < puntajeDto.umbralMinimo) {
      this.logger.warn(
        `⚠️ Puntaje bajo detectado! Enviando alerta a ${puntajeDto.usuarioEmail}`
      );

      await this.emailService.sendEmail({
        type: EMAIL.ALERTA_PUNTAJE_BAJO,
        params: {
          usuarioEmail: puntajeDto.usuarioEmail,
          usuarioNombre: puntajeDto.usuarioNombre,
          puntaje: puntajeDto.puntaje,
          descripcion: puntajeDto.descripcion,
          fecha: new Date().toLocaleString('es-ES', {
            dateStyle: 'full',
            timeStyle: 'short',
          }),
          umbralMinimo: puntajeDto.umbralMinimo,
        },
      });

      return {
        success: true,
        message: 'Alerta de puntaje bajo enviada exitosamente',
        alertaEnviada: true,
      };
    }

    this.logger.log('✅ Puntaje dentro del umbral aceptable. No se envía alerta.');
    return {
      success: true,
      message: 'Puntaje aceptable, no se requiere alerta',
      alertaEnviada: false,
    };
  }
}
