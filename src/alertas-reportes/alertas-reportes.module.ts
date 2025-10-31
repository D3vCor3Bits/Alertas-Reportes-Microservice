import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { AlertasReportesController } from './alertas-reportes.controller';
import { AlertasReportesService } from './alertas-reportes.service';

@Module({
  controllers: [AlertasReportesController],
  providers: [AlertasReportesService],
  imports: [NatsModule]
})
export class AlertasReportesModule {}
