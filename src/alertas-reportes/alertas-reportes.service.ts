import { Inject, Injectable, Logger } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { BaselineDto, PuntajeDto, SesionPuntajeDto } from './dto';
import { EmailService } from 'src/email/email.service';
import { EMAIL } from 'src/email/email.types';
import { firstValueFrom } from 'rxjs';
import { InvitacionUsuarioDto } from './dto/invitacionUsuario.dto';

@Injectable()
export class AlertasReportesService {

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly emailService: EmailService
  ) { }

  async generarAlertasPuntaje(puntajeDto: PuntajeDto) {
    // Si el puntaje es menor al umbral, enviar alerta
    if (puntajeDto.puntaje < puntajeDto.umbralMinimo) {
      await this.emailService.sendEmail({
        type: EMAIL.ALERTA_PUNTAJE_BAJO,
        params: {
          usuarioEmail: puntajeDto.usuarioEmail,
          nombrePaciente: puntajeDto.nombrePaciente,
          nombreDoctor: puntajeDto.nombreDoctor,
          puntaje: puntajeDto.puntaje,
          sesion: puntajeDto.sesion,
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
    return {
      success: true,
      message: 'Puntaje aceptable, no se requiere alerta',
      alertaEnviada: false,
    };
  }

  async generarReporte(idPaciente: string) {
    try {
      console.log("ENTREEEE")

      const sesiones: SesionPuntajeDto[] = await firstValueFrom(
        this.client.send({ cmd: 'listarSesionesCompletadas' }, { idPaciente })
      );
      const report = this.buildTimeSeriesReport(sesiones as SesionPuntajeDto[], idPaciente);
      return report;
    } catch (error) {
      throw new Error(error);
    }
  }

  private buildTimeSeriesReport(sesiones: SesionPuntajeDto[], patientId?: string) {
    if (!Array.isArray(sesiones)) return null;

    // ordenar por fecha ascendente
    const sessions = sesiones.slice().sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());

    const dates = sessions.map(s => s.fechaInicio);
    const get = (key: string) => sessions.map(s => (s[key] !== undefined ? s[key] : null));

    const timeseries = {
      dates,
      sessionTotal: get('sessionTotal'),
      sessionRecall: get('sessionRecall'),
      sessionComision: get('sessionComision'),
      sessionCoherencia: get('sessionCoherencia'),
      sessionFluidez: get('sessionFluidez'),
      sessionOmision: get('sessionOmision'),
    };

    // Preparar datos listos para Chart.js (labels + datasets)
    const labels = dates.map(d => (new Date(d)).toISOString().slice(0, 10)); // YYYY-MM-DD
    const chartData = {
      labels,
      datasets: [
        {
          label: 'Session Total',
          data: timeseries.sessionTotal.map(v => v),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.2,
          yAxisID: 'y'
        },
        {
          label: 'Session Recall',
          data: timeseries.sessionRecall.map(v => v),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.2,
          yAxisID: 'y'
        },
        {
          label: 'Session Coherencia',
          data: timeseries.sessionCoherencia.map(v => v),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.2,
          yAxisID: 'y'
        }
      ]
    };

    // Además, preparar datasets en formato {x,y} para usar eje temporal en el front (Chart.js time)
    const chartTimeDatasets = [
      {
        label: 'Session Total',
        data: sessions.map(s => ({ x: s.fechaInicio, y: s.sessionTotal ?? null })),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.2,
      },
      {
        label: 'Session Recall',
        data: sessions.map(s => ({ x: s.fechaInicio, y: s.sessionRecall ?? null })),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.2,
      },
      {
        label: 'Session Coherencia',
        data: sessions.map(s => ({ x: s.fechaInicio, y: s.sessionCoherencia ?? null })),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.2,
      }
    ];

    const count = sessions.length;
    const avg = (arr: (number | null)[]) => {
      const vals = arr.filter(v => typeof v === 'number') as number[];
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    };

    const avgSessionTotal = avg(timeseries.sessionTotal);
    const avgRecall = avg(timeseries.sessionRecall);

    const firstDate = sessions[0]?.fechaInicio ?? null;
    const lastDate = sessions[count - 1]?.fechaInicio ?? null;

    // slope per day for sessionTotal (simple approximation)
    let slopePerDay_sessionTotal: number | null = null;
    let trend_sessionTotal: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (count >= 2 && typeof timeseries.sessionTotal[0] === 'number' && typeof timeseries.sessionTotal[count - 1] === 'number') {
      const firstVal = timeseries.sessionTotal[0] as number;
      const lastVal = timeseries.sessionTotal[count - 1] as number;
      const days = (new Date(lastDate!).getTime() - new Date(firstDate!).getTime()) / (1000 * 60 * 60 * 24) || 1;
      slopePerDay_sessionTotal = (lastVal - firstVal) / days;
      trend_sessionTotal = slopePerDay_sessionTotal > 0.005 ? 'increasing' : slopePerDay_sessionTotal < -0.005 ? 'decreasing' : 'stable';
    }

    // (removed unused `sessionsOut` to keep the output minimal)

    // Construir versión limpia y compacta para frontend
    const sessionsMinimal = sessions.map(s => ({
      fechaInicio: s.fechaInicio,
      sessionTotal: s.sessionTotal ?? null,
      sessionRecall: s.sessionRecall ?? null,
      sessionCoherencia: s.sessionCoherencia ?? null,
      sessionFluidez: s.sessionFluidez ?? null,
      sessionOmision: s.sessionOmision ?? null,
    }));

    const cleanedReport = {
      patientId,
      period: { from: firstDate, to: lastDate },
      sessions: sessionsMinimal,
      timeseries,
      chartData: {
        ...chartData,
        // timePoints para uso con `scales.x.type = 'time'` en Chart.js
        timePoints: {
          datasets: chartTimeDatasets
        }
      },
      summary: {
        count,
        avgSessionTotal,
        avgRecall,
        firstSessionTotal: timeseries.sessionTotal[0] ?? null,
        lastSessionTotal: timeseries.sessionTotal[count - 1] ?? null,
        slopePerDay_sessionTotal,
        trend_sessionTotal,
      },
    };

    return cleanedReport;
  }

  async avisoBaseline(baselineDto: BaselineDto) {
    await this.emailService.sendEmail({
      type: EMAIL.AVISO_BASELINE,
      params: {
        usuarioEmail: baselineDto.usuarioEmail,
        fecha: new Date(),
        nombreDoctor: baselineDto.nombreDoctor,
        nombrePaciente: baselineDto.nombrePaciente,
        sessionCoherencia: baselineDto.sessionCoherencia,
        sessionComision: baselineDto.sessionComision,
        sessionFluidez: baselineDto.sessionFluidez,
        sessionOmision: baselineDto.sessionOmision,
        sessionRecall: baselineDto.sessionRecall,
        sessionTotal: baselineDto.sessionTotal,
      },
    });

    return {
      success: true,
      message: 'Aviso de baseline generado realizado',
      alertaEnviada: true,
    };
  }
  async crearInvitacionusuario(invitacionUsuario: InvitacionUsuarioDto) {
    /**
     * Esta función se ejecuta al recibir el evento 'invitacion_creada'
     * desde otro microservicio. 
     * 
     * Su propósito es enviar al usuario invitado un correo con el enlace 
     * de registro correspondiente según su rol (cuidador o paciente).
     * 
     * La plantilla de correo utilizada es `EMAIL.INVITACION_USUARIO`.
     */

    const { correo, nombreCompleto, token, rol } = invitacionUsuario;

    // Determina el tipo de usuario a partir del rol
    // La plantilla usará este valor para construir la URL final
    const type = rol.toUpperCase(); // "CUIDADOR" o "PACIENTE"

    // Envía el correo usando el servicio de envío de correos
    await this.emailService.sendEmail({
      type: EMAIL.INVITACION_USUARIO,
      params: {
        usuarioEmail: correo,
        type,
        token,
      },
    });

    return {
      success: true,
      message: `Correo de invitación enviado correctamente a ${nombreCompleto}`,
      correo,
      rol,
    };

  }

}
