import { Injectable } from '@nestjs/common';
import { CreateAlertasReporteDto } from './dto/create-alertas-reporte.dto';
import { UpdateAlertasReporteDto } from './dto/update-alertas-reporte.dto';

@Injectable()
export class AlertasReportesService {
  create(createAlertasReporteDto: CreateAlertasReporteDto) {
    return 'This action adds a new alertasReporte';
  }

  findAll() {
    return `This action returns all alertasReportes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alertasReporte`;
  }

  update(id: number, updateAlertasReporteDto: UpdateAlertasReporteDto) {
    return `This action updates a #${id} alertasReporte`;
  }

  remove(id: number) {
    return `This action removes a #${id} alertasReporte`;
  }
}
