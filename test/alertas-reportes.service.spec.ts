import { Test, TestingModule } from '@nestjs/testing';
import { AlertasReportesService } from '../src/alertas-reportes/alertas-reportes.service';
import { EmailService } from '../src/email/email.service';
import { ClientProxy } from '@nestjs/microservices';

describe('AlertasReportesService', () => {
  let service: AlertasReportesService;
  let emailService: EmailService;

  // Mock del servicio de email
  const mockEmailService = {
    sendEmail: jest.fn(),
  };

  // Mock del cliente NATS
  const mockNatsClient = {
    send: jest.fn(),
    emit: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertasReportesService,
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: 'NATS_SERVICE',
          useValue: mockNatsClient,
        },
      ],
    }).compile();

    service = module.get<AlertasReportesService>(AlertasReportesService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  /*-------------------------------------------------------------------------*/
  /*---------------------------GENERAR ALERTAS-------------------------------*/
  /*-------------------------------------------------------------------------*/

  describe('generarAlertasPuntaje', () => {
    it('debe enviar email cuando el puntaje es menor al umbral', async () => {
      // Arrange
      const puntajeDto = {
        usuarioEmail: 'usuario@ejemplo.com',
        usuarioNombre: 'Juan Pérez',
        puntaje: 3.5,
        descripcion: 'Una descripción de prueba',
        umbralMinimo: 5.0,
      };

      mockEmailService.sendEmail.mockResolvedValue({ success: true });

      // Act
      await service.generarAlertasPuntaje(puntajeDto);

      // Assert
      expect(emailService.sendEmail).toHaveBeenCalled();
      expect(emailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.any(String),
          params: expect.objectContaining({
            usuarioEmail: puntajeDto.usuarioEmail,
            usuarioNombre: puntajeDto.usuarioNombre,
            puntaje: puntajeDto.puntaje,
          }),
        }),
      );
    });

    it('NO debe enviar email cuando el puntaje es mayor o igual al umbral', async () => {
      // Arrange
      const puntajeDto = {
        usuarioEmail: 'usuario@ejemplo.com',
        usuarioNombre: 'Juan Pérez',
        puntaje: 8.5,
        descripcion: 'Una descripción excelente',
        umbralMinimo: 5.0,
      };

      // Act
      await service.generarAlertasPuntaje(puntajeDto);

      // Assert
      expect(emailService.sendEmail).not.toHaveBeenCalled();
    });

    it('debe manejar errores al enviar email', async () => {
      // Arrange
      const puntajeDto = {
        usuarioEmail: 'usuario@ejemplo.com',
        usuarioNombre: 'Juan Pérez',
        puntaje: 2.0,
        descripcion: 'Una descripción baja',
        umbralMinimo: 5.0,
      };

      mockEmailService.sendEmail.mockRejectedValue(
        new Error('Error al enviar email'),
      );

      // Act & Assert
      await expect(service.generarAlertasPuntaje(puntajeDto)).rejects.toThrow(
        'Error al enviar email',
      );
    });
  });

  /*-------------------------------------------------------------------------*/
  /*-----------------------------OTROS MÉTODOS-------------------------------*/
  /*-------------------------------------------------------------------------*/

  // TODO: Agregar tests cuando se implementen más métodos
  // Ejemplos:
  // - generarReporteSemanal()
  // - generarReporteMensual()
  // - obtenerEstadisticas()
  // - etc.
});
