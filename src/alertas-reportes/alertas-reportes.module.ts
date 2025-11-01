import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { AlertasReportesController } from './alertas-reportes.controller';
import { AlertasReportesService } from './alertas-reportes.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [AlertasReportesController],
  providers: [AlertasReportesService],
  imports: [NatsModule, EmailModule]
})
export class AlertasReportesModule {}
