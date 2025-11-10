import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ActivacionSesionDto, BaselineDto, DesactivacionSesionDto, PuntajeDto, SesionPuntajeDto } from './dto';
import { EmailService } from 'src/email/email.service';
import { EMAIL } from 'src/email/email.types';
import { firstValueFrom } from 'rxjs';
import { InvitacionUsuarioDto } from './dto/invitacionUsuario.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AlertasReportesService {
  private readonly logger = new Logger(AlertasReportesService.name);

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly emailService: EmailService,
  ) {}

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
          fecha: new Date().toLocaleString('es-CO', {
            timeZone: 'America/Bogota',
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
      const sesiones: any[] = await firstValueFrom(
        this.client.send({ cmd: 'listarSesionesCompletadas' }, { idPaciente }),
      );
      
      if (!sesiones || sesiones.length === 0) {
        return {
          idPaciente,
          mensaje: 'No hay sesiones completadas para generar el reporte',
          sesiones: [],
        };
      }

      return this.construirReporte(sesiones, idPaciente);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al generar el reporte',
        detalle: error.message,
      });
    }
  }

  /**
   * Construye un reporte limpio y estructurado con las sesiones del paciente
   */
  private construirReporte(sesionesRaw: any[], idPaciente: string) {
    // 1. Parsear y ordenar sesiones por fecha
    const sesiones = this.prepararSesiones(sesionesRaw);

    // 2. Calcular métricas estadísticas
    const estadisticas = this.calcularEstadisticas(sesiones);

    // 3. Analizar tendencias
    const tendencias = this.analizarTendencias(sesiones);

    // 4. Generar datos para gráficos (estructura simple para el frontend)
    const datosGraficos = this.generarDatosGraficos(sesiones);

    // 5. Resumen clínico
    const resumenClinico = this.generarResumenClinico(sesiones, estadisticas, tendencias);

    const formatoFechaCO = (fecha: string | null) => {
      if (!fecha) return null;
      return new Date(fecha).toLocaleString('es-CO', {
        timeZone: 'America/Bogota',
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    };

    return {
      idPaciente,
      fechaGeneracion: formatoFechaCO(new Date().toISOString()),
      periodo: {
        inicio: formatoFechaCO(sesiones[0]?.fecha),
        fin: formatoFechaCO(sesiones[sesiones.length - 1]?.fecha),
        totalSesiones: sesiones.length,
      },
      sesiones: sesiones.map(s => ({
        numero: s.numero,
        fecha: formatoFechaCO(s.fecha),
        metricas: {
          total: s.sessionTotal,
          recall: s.sessionRecall,
          coherencia: s.sessionCoherencia,
          fluidez: s.sessionFluidez,
          omision: s.sessionOmision,
          comision: s.sessionComision,
        },
      })),
      estadisticas,
      tendencias,
      datosGraficos,
      resumenClinico,
    };
  }

  /**
   * Parsea fechas y ordena sesiones cronológicamente
   */
  private prepararSesiones(sesionesRaw: any[]) {
    const parseFecha = (input: any): Date | null => {
      if (!input) return null;
      if (input instanceof Date) return isNaN(input.getTime()) ? null : input;
      
      try {
        let d = new Date(input);
        if (!isNaN(d.getTime())) return d;
        
        // Manejar formato Supabase: "YYYY-MM-DD HH:mm:ss+00"
        if (typeof input === 'string' && input.includes(' ')) {
          d = new Date(input.replace(' ', 'T'));
          if (!isNaN(d.getTime())) return d;
        }
      } catch (e) {
        // ignore
      }
      return null;
    };

    return sesionesRaw
      .map((s, idx) => ({
        numero: idx + 1,
        fecha: parseFecha(s.fechaInicioPropuesta || s.fechaCreacion || s.fechaInicio)?.toISOString() || null,
        sessionTotal: s.sessionTotal ?? 0,
        sessionRecall: s.sessionRecall ?? 0,
        sessionCoherencia: s.sessionCoherencia ?? 0,
        sessionFluidez: s.sessionFluidez ?? 0,
        sessionOmision: s.sessionOmision ?? 0,
        sessionComision: s.sessionComision ?? 0,
        conclusionTecnica: s.conclusionTecnica || null,
        conclusionNormal: s.conclusionNormal || null,
      }))
      .sort((a, b) => {
        if (!a.fecha && !b.fecha) return 0;
        if (!a.fecha) return 1;
        if (!b.fecha) return -1;
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      })
      .map((s, idx) => ({ ...s, numero: idx + 1 })); // Renumerar después de ordenar
  }

  /**
   * Calcula estadísticas agregadas de todas las métricas
   */
  private calcularEstadisticas(sesiones: any[]) {
    const calcular = (metrica: string) => {
      const valores = sesiones.map(s => s[metrica]).filter(v => typeof v === 'number');
      if (valores.length === 0) return { promedio: null, minimo: null, maximo: null };

      return {
        promedio: +(valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(4),
        minimo: +Math.min(...valores).toFixed(4),
        maximo: +Math.max(...valores).toFixed(4),
      };
    };

    return {
      total: calcular('sessionTotal'),
      recall: calcular('sessionRecall'),
      coherencia: calcular('sessionCoherencia'),
      fluidez: calcular('sessionFluidez'),
      omision: calcular('sessionOmision'),
      comision: calcular('sessionComision'),
    };
  }

  /**
   * Analiza tendencias comparando primera vs última sesión
   */
  private analizarTendencias(sesiones: any[]) {
    if (sesiones.length < 2) {
      return {
        mensaje: 'Se requieren al menos 2 sesiones para analizar tendencias',
        disponible: false,
      };
    }

    const primera = sesiones[0];
    const ultima = sesiones[sesiones.length - 1];

    const calcularCambio = (inicial: number, final: number) => {
      if (inicial === 0) return { absoluto: final, porcentual: null, direccion: 'sin-cambio' };
      const absoluto = final - inicial;
      const porcentual = (absoluto / inicial) * 100;
      const direccion = absoluto > 0.05 ? 'mejora' : absoluto < -0.05 ? 'declive' : 'estable';
      
      return {
        absoluto: +absoluto.toFixed(4),
        porcentual: +porcentual.toFixed(2),
        direccion,
      };
    };

    return {
      disponible: true,
      comparacion: {
        primera: { numero: primera.numero, fecha: primera.fecha },
        ultima: { numero: ultima.numero, fecha: ultima.fecha },
      },
      cambios: {
        total: calcularCambio(primera.sessionTotal, ultima.sessionTotal),
        recall: calcularCambio(primera.sessionRecall, ultima.sessionRecall),
        coherencia: calcularCambio(primera.sessionCoherencia, ultima.sessionCoherencia),
        fluidez: calcularCambio(primera.sessionFluidez, ultima.sessionFluidez),
        omision: calcularCambio(primera.sessionOmision, ultima.sessionOmision),
        comision: calcularCambio(primera.sessionComision, ultima.sessionComision),
      },
    };
  }

  /**
   * Genera estructura simple de datos para gráficos (el frontend arma Chart.js)
   */
  private generarDatosGraficos(sesiones: any[]) {
    const formatoFechaCO = (fecha: string | null) => {
      if (!fecha) return null;
      return new Date(fecha).toLocaleString('es-CO', {
        timeZone: 'America/Bogota',
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    };

    return {
      fechas: sesiones.map(s => formatoFechaCO(s.fecha)),
      series: {
        total: sesiones.map(s => s.sessionTotal),
        recall: sesiones.map(s => s.sessionRecall),
        coherencia: sesiones.map(s => s.sessionCoherencia),
        fluidez: sesiones.map(s => s.sessionFluidez),
        omision: sesiones.map(s => s.sessionOmision),
        comision: sesiones.map(s => s.sessionComision),
      },
    };
  }

  /**
   * Genera un resumen clínico interpretativo para médicos y cuidadores
   */
  private generarResumenClinico(sesiones: any[], estadisticas: any, tendencias: any) {
    const interpretacion: string[] = [];

    // Mapeo de nombres técnicos a español
    const nombresEspanol = {
      recall: 'recuerdo',
      coherencia: 'coherencia',
      fluidez: 'fluidez',
      omision: 'omisión',
      comision: 'comisión',
      total: 'total',
    };

    // Interpretar puntaje total promedio
    const avgTotal = estadisticas.total.promedio;
    if (avgTotal !== null) {
      if (avgTotal >= 0.7) {
        interpretacion.push(`Rendimiento global alto (promedio: ${avgTotal.toFixed(2)})`);
      } else if (avgTotal >= 0.5) {
        interpretacion.push(`Rendimiento global moderado (promedio: ${avgTotal.toFixed(2)})`);
      } else {
        interpretacion.push(`Rendimiento global bajo (promedio: ${avgTotal.toFixed(2)}), requiere atención`);
      }
    }

    // Interpretar tendencias
    if (tendencias.disponible) {
      const cambioTotal = tendencias.cambios.total;
      if (cambioTotal.direccion === 'mejora') {
        interpretacion.push(`Tendencia positiva: mejora del ${cambioTotal.porcentual}% en puntaje total`);
      } else if (cambioTotal.direccion === 'declive') {
        interpretacion.push(`Tendencia negativa: declive del ${Math.abs(cambioTotal.porcentual)}% en puntaje total`);
      } else {
        interpretacion.push('Rendimiento estable sin cambios significativos');
      }
    }

    // Identificar fortalezas y debilidades
    const metricas = ['recall', 'coherencia', 'fluidez'];
    const promedios = metricas.map(m => ({ nombre: m, valor: estadisticas[m].promedio }));
    const ordenadas = promedios.sort((a, b) => b.valor - a.valor);

    interpretacion.push(`Fortaleza principal: ${nombresEspanol[ordenadas[0].nombre]} (${ordenadas[0].valor.toFixed(2)})`);
    interpretacion.push(`Área de oportunidad: ${nombresEspanol[ordenadas[ordenadas.length - 1].nombre]} (${ordenadas[ordenadas.length - 1].valor.toFixed(2)})`);

    return {
      interpretacion,
      recomendaciones: this.generarRecomendaciones(estadisticas, tendencias),
    };
  }

  /**
   * Genera recomendaciones de observación clínica basadas en las métricas
   */
  private generarRecomendaciones(estadisticas: any, tendencias: any): string[] {
    const recomendaciones: string[] = [];

    // Recomendación basada en recall
    if (estadisticas.recall.promedio < 0.5) {
      recomendaciones.push('Prestar atención al paciente en cuanto a la capacidad de recordar detalles específicos durante las descripciones');
    }

    // Recomendación basada en coherencia
    if (estadisticas.coherencia.promedio < 0.6) {
      recomendaciones.push('Observar al paciente en cuanto a la organización y coherencia de sus narrativas');
    }

    // Recomendación basada en omisión
    if (estadisticas.omision.promedio > 0.5) {
      recomendaciones.push('Prestar atención al paciente en cuanto a la omisión de información relevante y detalles específicos de las imágenes');
    }

    // Recomendación basada en comisión
    if (estadisticas.comision.promedio > 0.3) {
      recomendaciones.push('Observar al paciente en cuanto a la adición de información no presente en las imágenes');
    }

    // Recomendación basada en tendencia
    if (tendencias.disponible && tendencias.cambios.total.direccion === 'declive') {
      recomendaciones.push('Monitorear de cerca al paciente debido a la tendencia negativa en el rendimiento general');
    }

    // Recomendación positiva si todo está bien
    if (recomendaciones.length === 0) {
      recomendaciones.push('El paciente muestra un desempeño adecuado. Continuar monitoreando el progreso en las sesiones');
    }

    return recomendaciones;
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


  async crearInvitacionUsuario(invitacionUsuario: InvitacionUsuarioDto) {
    try {
      const { email, nombreCompleto, token, rol } = invitacionUsuario;

      await this.emailService.sendEmail({
        type: EMAIL.INVITACION_USUARIO,
        params: {
          usuarioEmail: invitacionUsuario.email,
          nombreCompleto,
          rol,
          token,
        },
      });
      return {
        success: true,
        message: `Correo enviado a ${email}`,
      };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al procesar el envío del email',
        detalle: error.message,
      });
    }
  }
  

  async activacionSesion(activacionSesionDto: ActivacionSesionDto){
    const logger = new Logger(AlertasReportesService.name);
    logger.log('Enviando email de activación de sesión');
    try {
      await this.emailService.sendEmail({
        type: EMAIL.ACTIVACION_SESION,
        params: {
          usuarioEmail: activacionSesionDto.usuarioEmail,
          nombreCompleto: activacionSesionDto.nombreCompleto,
          fecha: new Date(),
          sessionNumber: activacionSesionDto.sessionNumber,
        },
      });

      return {
        success: true,
        message: 'Aviso de sesión activada realizado',
        alertaEnviada: true,
      };
    } catch (error) {
      throw new RpcException(error)
    }
  }

  async desactivacionSesion(desactivacionDto: DesactivacionSesionDto){
    const logger = new Logger(AlertasReportesService.name);
    logger.log('Enviando email de desactivación de sesión');
    try {
      await this.emailService.sendEmail({
        type: EMAIL.DESACTIVACION_SESION,
        params: {
          usuarioEmail: desactivacionDto.usuarioEmail,
          nombreCompleto: desactivacionDto.nombreCompleto,
          fecha: new Date(),
          sessionNumber: desactivacionDto.sessionNumber,
        },
      });

      return {
        success: true,
        message: 'Aviso de sesión desactivada realizado',
        alertaEnviada: true,
      };
    } catch (error) {
      logger.error('Error enviando email de desactivación', error as any);
      return {
        success: false,
        message: 'Error al enviar aviso de desactivación',
        detalle: (error as Error).message,
      };
    }
  }

  /**
   * Cron job que verifica usuarios inactivos con sesiones activas
   */
  @Cron(CronExpression.EVERY_12_HOURS) 
  async verificarInactivosConSesiones() {
    const HORAS_INACTIVIDAD = 24; 
    try {
      // 1. Obtener pacientes con sesiones activas desde descripciones-imagenes-ms
      const { pacientes: pacientesConSesiones } = await firstValueFrom(
        this.client.send({cmd:'obtenerPacientesConSesionesActivas'}, {})
      );

      if (!pacientesConSesiones || pacientesConSesiones.length === 0) {
        return;
      }

      // 2. Filtrar por inactividad desde usuarios-autenticacion-ms
      const { usuarios } = await firstValueFrom(
        this.client.send(
          { cmd: 'listarUsuariosInactivosConSesiones' },
          { horasInactividad: HORAS_INACTIVIDAD, pacientesConSesiones }
        )
      );

      for (const u of usuarios || []) {
        try {
          const ultimoLogin = new Date(u.last_login).toLocaleString('es-CO', {
            timeZone: 'America/Bogota',
            dateStyle: 'medium',
            timeStyle: 'short'
          });

          await this.emailService.sendEmail({
            type: EMAIL.RECORDATORIO_SESIONES_ACTIVAS,
            params: {
              usuarioEmail: u.email,
              nombreUsuario: u.nombre,
              sesionesActivas: u.sesiones_activas,
              horasInactivo: HORAS_INACTIVIDAD,
              ultimoLogin,
            },
          });

          // Registrar en NOTIFICACION_USO
          await firstValueFrom(
            this.client.send(
              { cmd: 'registrarAlertaInactividad' },
              { userId: u.id_usuario }
            )
          );

        } catch (err) {
          this.logger.error(`Error enviando alerta a ${u.email}: ${(err as Error).message}`);
        }
      }

      this.logger.log(`Verificación completada. Alertas enviadas: ${usuarios?.length || 0}`);
    } catch (err) {
      this.logger.error(`Error en verificación de inactividad: ${(err as Error).message}`);
    }
  }
}
