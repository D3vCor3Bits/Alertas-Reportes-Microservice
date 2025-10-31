import { Module } from '@nestjs/common';
import { AlertasReportesService } from './alertas-reportes.service';
import { AlertasReportesController } from './alertas-reportes.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [AlertasReportesController],
  providers: [AlertasReportesService],
  imports: [NatsModule]
})
export class AlertasReportesModule {}
