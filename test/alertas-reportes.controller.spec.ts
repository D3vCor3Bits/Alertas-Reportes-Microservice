import { Test, TestingModule } from '@nestjs/testing';
import { AlertasReportesController } from '../src/alertas-reportes/alertas-reportes.controller';
import { AlertasReportesService } from '../src/alertas-reportes/alertas-reportes.service';

describe('AlertasReportesController', () => {
  let controller: AlertasReportesController;
  let service: AlertasReportesService;

  // Mock del servicio
  const mockAlertasReportesService = {
    generarAlertasPuntaje: jest.fn(),
    generarReporte: jest.fn(),
    avisoBaseline: jest.fn(),
    crearInvitacionUsuario: jest.fn(),
    activacionSesion: jest.fn(),
    desactivacionSesion: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertasReportesController],
      providers: [
        {
          provide: AlertasReportesService,
          useValue: mockAlertasReportesService,
        },
      ],
    }).compile();

    controller = module.get<AlertasReportesController>(
      AlertasReportesController,
    );
    service = module.get<AlertasReportesService>(AlertasReportesService);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  /*-------------------------------------------------------------------------*/
  /*--------------------------EVALUAR PUNTAJE--------------------------------*/
  /*-------------------------------------------------------------------------*/

  describe('evaluarPuntaje', () => {
    it('debe llamar a generarAlertasPuntaje del servicio y retornar resultado', async () => {
      // Arrange
      const puntajeDto = {
        usuarioEmail: 'usuario@ejemplo.com',
        nombrePaciente: 'Juan Pérez',
        nombreDoctor: 'Dr. García',
        puntaje: 3.5,
        sesion: 1,
        umbralMinimo: 5.0,
      };

      const mockResponse = {
        success: true,
        message: 'Alerta de puntaje bajo enviada exitosamente',
        alertaEnviada: true,
      };

      mockAlertasReportesService.generarAlertasPuntaje.mockResolvedValue(
        mockResponse,
      );

      // Act
      const resultado = await controller.evaluarPuntaje(puntajeDto);

      // Assert
      expect(service.generarAlertasPuntaje).toHaveBeenCalledWith(puntajeDto);
      expect(service.generarAlertasPuntaje).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(mockResponse);
    });

    it('debe manejar errores del servicio', async () => {
      // Arrange
      const puntajeDto = {
        usuarioEmail: 'usuario@ejemplo.com',
        nombrePaciente: 'Juan Pérez',
        nombreDoctor: 'Dr. García',
        puntaje: 2.0,
        sesion: 1,
        umbralMinimo: 5.0,
      };

      mockAlertasReportesService.generarAlertasPuntaje.mockRejectedValue(
        new Error('Error al procesar alerta'),
      );

      // Act & Assert
      await expect(controller.evaluarPuntaje(puntajeDto)).rejects.toThrow(
        'Error al procesar alerta',
      );
      expect(service.generarAlertasPuntaje).toHaveBeenCalledWith(puntajeDto);
    });
  });

  /*-------------------------------------------------------------------------*/
  /*-----------------------------OTROS ENDPOINTS-----------------------------*/
  /*-------------------------------------------------------------------------*/

  describe('reporte', () => {
    it('debe llamar a generarReporte del servicio', async () => {
      // Arrange
      const idPaciente = 'uuid-paciente-123';
      const mockReporte = {
        idPaciente,
        fechaGeneracion: '2024-01-15',
        sesiones: [],
      };

      mockAlertasReportesService.generarReporte.mockResolvedValue(mockReporte);

      // Act
      const resultado = await controller.reporte(idPaciente);

      // Assert
      expect(service.generarReporte).toHaveBeenCalledWith(idPaciente);
      expect(resultado).toEqual(mockReporte);
    });
  });

  describe('generarAvisoBaseline', () => {
    it('debe llamar a avisoBaseline del servicio y retornar resultado', async () => {
      // Arrange
      const baselineDto = {
        usuarioEmail: 'doctor@example.com',
        nombrePaciente: 'Juan Pérez',
        nombreDoctor: 'Dr. García',
        sessionRecall: 0.8,
        sessionComision: 0.2,
        sessionOmision: 0.1,
        sessionCoherencia: 0.9,
        sessionFluidez: 0.85,
        sessionTotal: 0.75,
      };

      const mockResponse = {
        success: true,
        message: 'Aviso de baseline generado realizado',
        alertaEnviada: true,
      };

      mockAlertasReportesService.avisoBaseline.mockResolvedValue(mockResponse);

      // Act
      const resultado = await controller.generarAvisoBaseline(baselineDto);

      // Assert
      expect(service.avisoBaseline).toHaveBeenCalledWith(baselineDto);
      expect(resultado).toEqual(mockResponse);
    });
  });

  describe('crearInvitacionusuario', () => {
    it('debe llamar a crearInvitacionUsuario del servicio y retornar resultado', async () => {
      // Arrange
      const invitacionDto = {
        email: 'nuevo@example.com',
        nombreCompleto: 'Juan Nuevo',
        rol: 'paciente',
        token: 'token-abc123',
      };

      const mockResponse = {
        success: true,
        message: `Correo enviado a ${invitacionDto.email}`,
      };

      mockAlertasReportesService.crearInvitacionUsuario.mockResolvedValue(
        mockResponse,
      );

      // Act
      const resultado = await controller.crearInvitacionusuario(invitacionDto);

      // Assert
      expect(service.crearInvitacionUsuario).toHaveBeenCalledWith(
        invitacionDto,
      );
      expect(resultado).toEqual(mockResponse);
    });
  });

  describe('avisoSesionActivada', () => {
    it('debe llamar a activacionSesion del servicio y retornar resultado', async () => {
      // Arrange
      const activacionDto = {
        usuarioEmail: 'paciente@example.com',
        nombreCompleto: 'Juan Pérez',
        sessionNumber: 1,
      };

      const mockResponse = {
        success: true,
        message: 'Aviso de sesión activada realizado',
        alertaEnviada: true,
      };

      mockAlertasReportesService.activacionSesion.mockResolvedValue(mockResponse);

      // Act
      const resultado = await controller.avisoSesionActivada(activacionDto);

      // Assert
      expect(service.activacionSesion).toHaveBeenCalledWith(activacionDto);
      expect(resultado).toEqual(mockResponse);
    });
  });

  describe('avisoDesactivacion', () => {
    it('debe llamar a desactivacionSesion del servicio y retornar resultado', async () => {
      // Arrange
      const desactivacionDto = {
        usuarioEmail: 'paciente@example.com',
        nombreCompleto: 'Juan Pérez',
        sessionNumber: 1,
      };

      const mockResponse = {
        success: true,
        message: 'Aviso de sesión desactivada realizado',
        alertaEnviada: true,
      };

      mockAlertasReportesService.desactivacionSesion.mockResolvedValue(
        mockResponse,
      );

      // Act
      const resultado = await controller.avisoDesactivacion(desactivacionDto);

      // Assert
      expect(service.desactivacionSesion).toHaveBeenCalledWith(
        desactivacionDto,
      );
      expect(resultado).toEqual(mockResponse);
    });
  });
});

