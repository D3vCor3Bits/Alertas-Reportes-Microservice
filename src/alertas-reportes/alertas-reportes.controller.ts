import { Controller, Param, ParseIntPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AlertasReportesService } from './alertas-reportes.service';
import { PuntajeDto, ReporteDto } from './dto';

@Controller()
export class AlertasReportesController {
  constructor(private readonly alertasReportesService: AlertasReportesService) {}

  @EventPattern({cmd:'alertasEvaluarPuntaje'})
  evaluarPuntaje(@Payload() puntajeDto: PuntajeDto) {
    return this.alertasReportesService.generarAlertasPuntaje(puntajeDto);
  }

  @MessagePattern({cmd:'reporteTiempo'})
  async reporte(@Payload('idPaciente', ParseIntPipe) idPaciente: number ){
    return await this.alertasReportesService.generarReporte(idPaciente);
  }
}
