import { Module } from '@nestjs/common';
import { AlertasReportesService } from './alertas-reportes.service';
import { AlertasReportesController } from './alertas-reportes.controller';

@Module({
  controllers: [AlertasReportesController],
  providers: [AlertasReportesService],
})
export class AlertasReportesModule {}
