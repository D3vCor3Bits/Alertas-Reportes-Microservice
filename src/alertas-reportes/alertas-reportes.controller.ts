import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AlertasReportesService } from './alertas-reportes.service';
import { CreateAlertasReporteDto } from './dto/create-alertas-reporte.dto';
import { UpdateAlertasReporteDto } from './dto/update-alertas-reporte.dto';

@Controller()
export class AlertasReportesController {
  constructor(private readonly alertasReportesService: AlertasReportesService) {}

  @MessagePattern('createAlertasReporte')
  create(@Payload() createAlertasReporteDto: CreateAlertasReporteDto) {
    return this.alertasReportesService.create(createAlertasReporteDto);
  }

  @MessagePattern('findAllAlertasReportes')
  findAll() {
    return this.alertasReportesService.findAll();
  }

  @MessagePattern('findOneAlertasReporte')
  findOne(@Payload() id: number) {
    return this.alertasReportesService.findOne(id);
  }

  @MessagePattern('updateAlertasReporte')
  update(@Payload() updateAlertasReporteDto: UpdateAlertasReporteDto) {
    return this.alertasReportesService.update(updateAlertasReporteDto.id, updateAlertasReporteDto);
  }

  @MessagePattern('removeAlertasReporte')
  remove(@Payload() id: number) {
    return this.alertasReportesService.remove(id);
  }
}
