import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateAlertasReporteDto } from './dto/create-alertas-reporte.dto';
import { UpdateAlertasReporteDto } from './dto/update-alertas-reporte.dto';
import { AlertasReportesService } from './alertas-reportes.service';
import { PuntajeDto } from './dto';

@Controller()
export class AlertasReportesController {
  constructor(private readonly alertasReportesService: AlertasReportesService) {}

  @MessagePattern('alertas.evaluar.puntaje')
  async evaluarPuntaje(@Payload() puntajeDto: PuntajeDto) {
    return this.alertasReportesService.generarAlertasPuntaje(puntajeDto);
  }
}
