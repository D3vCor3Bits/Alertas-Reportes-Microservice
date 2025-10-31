import { PartialType } from '@nestjs/mapped-types';
import { CreateAlertasReporteDto } from './create-alertas-reporte.dto';

export class UpdateAlertasReporteDto extends PartialType(CreateAlertasReporteDto) {
  id: number;
}
