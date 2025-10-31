import { Module } from '@nestjs/common';
import { AlertasReportesModule } from './alertas-reportes/alertas-reportes.module';

@Module({
  imports: [AlertasReportesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
