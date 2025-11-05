import { Controller, Param, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AlertasReportesService } from './alertas-reportes.service';
import { BaselineDto, PuntajeDto  } from './dto';
import { InvitacionUsuarioDto } from './dto/invitacionUsuario.dto';

@Controller()
export class AlertasReportesController {
  constructor(private readonly alertasReportesService: AlertasReportesService) {}

  @EventPattern({cmd:'alertasEvaluarPuntaje'})
  evaluarPuntaje(@Payload() puntajeDto: PuntajeDto) {
    return this.alertasReportesService.generarAlertasPuntaje(puntajeDto);
  }

  @MessagePattern({cmd:'reporteTiempo'})
  async reporte(@Payload('idPaciente', ParseUUIDPipe) idPaciente: string ){
    return await this.alertasReportesService.generarReporte(idPaciente);
  }

  @EventPattern({cmd:'generarAvisoBaseline'})
  generarAvisoBaseline(@Payload() baselineDto: BaselineDto){
    return this.alertasReportesService.avisoBaseline(baselineDto);
  }

  @EventPattern({cmd:'crearInvitacionUsuario'})
  crearInvitacionusuario(@Payload() invitacionUsuario : InvitacionUsuarioDto ){
    return this.alertasReportesService.crearInvitacionUsuario(invitacionUsuario)
  }
}
