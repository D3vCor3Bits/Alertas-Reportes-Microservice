import { Test, TestingModule } from '@nestjs/testing';
import { AlertasReportesService } from '../src/alertas-reportes/alertas-reportes.service';
import { EmailService } from '../src/email/email.service';
import { of } from 'rxjs';

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
        nombrePaciente: 'Juan Pérez',
        nombreDoctor: 'Dr. García',
        puntaje: 3.5,
        sesion: 1,
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
            nombrePaciente: puntajeDto.nombrePaciente,
            puntaje: puntajeDto.puntaje,
          }),
        }),
      );
    });

    it('NO debe enviar email cuando el puntaje es mayor o igual al umbral', async () => {
      // Arrange
      const puntajeDto = {
        usuarioEmail: 'usuario@ejemplo.com',
        nombrePaciente: 'Juan Pérez',
        nombreDoctor: 'Dr. García',
        puntaje: 8.5,
        sesion: 1,
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
        nombrePaciente: 'Juan Pérez',
        nombreDoctor: 'Dr. García',
        puntaje: 2.0,
        sesion: 1,
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
  /*-----------------------------REPORTE TIEMPO------------------------------*/
  /*-------------------------------------------------------------------------*/

  describe('generarReporte', () => {
    it('debe generar reporte con sesiones completadas', async () => {
      // Arrange
      const idPaciente = 'uuid-paciente';
      const mockSesiones = [
        {
          id: 'sesion-1',
          fecha: '2024-01-15',
          puntaje: 85,
          completada: true,
        },
        {
          id: 'sesion-2',
          fecha: '2024-01-20',
          puntaje: 90,
          completada: true,
        },
      ];

      mockNatsClient.send.mockReturnValue(of(mockSesiones));

      // Act
      const resultado = await service.generarReporte(idPaciente);

      // Assert
      expect(mockNatsClient.send).toHaveBeenCalledWith(
        { cmd: 'listarSesionesCompletadas' },
        { idPaciente },
      );
      expect(resultado).toBeDefined();
    });

    it('debe devolver mensaje cuando no hay sesiones completadas', async () => {
      // Arrange
      const idPaciente = 'uuid-paciente';

      mockNatsClient.send.mockReturnValue(of([]));

      // Act
      const resultado = await service.generarReporte(idPaciente);

      // Assert
      expect(resultado).toEqual({
        idPaciente,
        mensaje: 'No hay sesiones completadas para generar el reporte',
        sesiones: [],
      });
    });
  });

  /*-------------------------------------------------------------------------*/
  /*---------------------------AVISO BASELINE--------------------------------*/
  /*-------------------------------------------------------------------------*/

  describe('avisoBaseline', () => {
    it('debe enviar aviso de baseline', async () => {
      // Arrange
      const baselineDto = {
        usuarioEmail: 'doctor@example.com',
        nombrePaciente: 'Juan Pérez',
        nombreDoctor: 'Dr. García',
        sessionRecall: 0.8,
        sessionComision: 0.1,
        sessionOmision: 0.2,
        sessionCoherencia: 0.9,
        sessionFluidez: 0.85,
        sessionTotal: 0.75,
      };

      mockEmailService.sendEmail.mockResolvedValue({ success: true });

      // Act
      await service.avisoBaseline(baselineDto);

      // Assert
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.any(String),
          params: expect.objectContaining({
            usuarioEmail: baselineDto.usuarioEmail,
          }),
        }),
      );
    });
  });

  /*-------------------------------------------------------------------------*/
  /*-------------------------INVITACIÓN USUARIO------------------------------*/
  /*-------------------------------------------------------------------------*/

  describe('crearInvitacionUsuario', () => {
    it('debe enviar invitación a usuario', async () => {
      // Arrange
      const invitacionDto = {
        email: 'nuevo@example.com',
        nombreCompleto: 'María García',
        rol: 'cuidador',
        token: 'token-123',
      };

      mockEmailService.sendEmail.mockResolvedValue({ success: true });

      // Act
      await service.crearInvitacionUsuario(invitacionDto);

      // Assert
      expect(mockEmailService.sendEmail).toHaveBeenCalled();
    });
  });

  /*-------------------------------------------------------------------------*/
  /*-------------------------ACTIVACIÓN SESIÓN-------------------------------*/
  /*-------------------------------------------------------------------------*/

  describe('activacionSesion', () => {
    it('debe enviar aviso de activación de sesión', async () => {
      // Arrange
      const activacionDto = {
        usuarioEmail: 'paciente@example.com',
        nombreCompleto: 'Juan Pérez',
        sessionNumber: 1,
      };

      mockEmailService.sendEmail.mockResolvedValue({ success: true });

      // Act
      await service.activacionSesion(activacionDto);

      // Assert
      expect(mockEmailService.sendEmail).toHaveBeenCalled();
    });
  });

  /*-------------------------------------------------------------------------*/
  /*------------------------DESACTIVACIÓN SESIÓN-----------------------------*/
  /*-------------------------------------------------------------------------*/

  describe('desactivacionSesion', () => {
    it('debe enviar aviso de desactivación de sesión', async () => {
      // Arrange
      const desactivacionDto = {
        usuarioEmail: 'paciente@example.com',
        nombreCompleto: 'Juan Pérez',
        sessionNumber: 1,
      };

      mockEmailService.sendEmail.mockResolvedValue({ success: true });

      // Act
      await service.desactivacionSesion(desactivacionDto);

      // Assert
      expect(mockEmailService.sendEmail).toHaveBeenCalled();
    });
  });

  /*-------------------------------------------------------------------------*/
  /*-------------------VERIFICAR INACTIVOS CON SESIONES----------------------*/
  /*-------------------------------------------------------------------------*/

  describe('verificarInactivosConSesiones', () => {
    it('debe enviar alertas a usuarios inactivos con sesiones activas', async () => {
      // Arrange
      const mockPacientesConSesiones = [
        { id: 'paciente-1', nombre: 'Juan Pérez' },
        { id: 'paciente-2', nombre: 'María García' },
      ];

      const mockUsuariosInactivos = [
        {
          id_usuario: 'user-1',
          email: 'juan@example.com',
          nombre: 'Juan Pérez',
          last_login: new Date('2024-01-01T10:00:00Z').toISOString(),
          sesiones_activas: 3,
        },
      ];

      mockNatsClient.send
        .mockReturnValueOnce(of({ pacientes: mockPacientesConSesiones }))
        .mockReturnValueOnce(of({ usuarios: mockUsuariosInactivos }))
        .mockReturnValue(of({ success: true }));

      mockEmailService.sendEmail.mockResolvedValue({ success: true });

      // Act
      await service.verificarInactivosConSesiones();

      // Assert
      expect(mockNatsClient.send).toHaveBeenCalledWith(
        { cmd: 'obtenerPacientesConSesionesActivas' },
        {},
      );
      expect(mockNatsClient.send).toHaveBeenCalledWith(
        { cmd: 'listarUsuariosInactivosConSesiones' },
        expect.objectContaining({
          horasInactividad: 24,
        }),
      );
      expect(mockEmailService.sendEmail).toHaveBeenCalled();
    });

    it('debe manejar el caso sin pacientes con sesiones activas', async () => {
      // Arrange
      mockNatsClient.send.mockReturnValue(of({ pacientes: [] }));

      // Act
      await service.verificarInactivosConSesiones();

      // Assert
      expect(mockNatsClient.send).toHaveBeenCalledTimes(1);
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    });
  });
});

