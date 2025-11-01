// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
// import { firstValueFrom } from 'rxjs';
// import { AppModule } from '../src/app.module';
// import { EmailService } from '../src/email/email.service';

// describe('AlertasReportesMS E2E Tests', () => {
//   let app: INestApplication;
//   let client: ClientProxy;

//   // Mock de EmailService (para evitar enviar emails reales)
//   const mockEmailService = {
//     sendEmail: jest.fn(),
//   };

//   beforeAll(async () => {
//     // Crear módulo de testing con cliente NATS
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [
//         AppModule,
//         ClientsModule.register([
//           {
//             name: 'NATS_SERVICE',
//             transport: Transport.NATS,
//             options: {
//               servers: [process.env.NATS_SERVERS || 'nats://localhost:4222'],
//             },
//           },
//         ]),
//       ],
//     })
//       .overrideProvider(EmailService)
//       .useValue(mockEmailService)
//       .compile();

//     app = moduleFixture.createNestApplication();
    
//     // Conectar como microservicio NATS
//     app.connectMicroservice({
//       transport: Transport.NATS,
//       options: {
//         servers: [process.env.NATS_SERVERS || 'nats://localhost:4222'],
//       },
//     });

//     await app.startAllMicroservices();
//     await app.init();

//     // Obtener cliente NATS para enviar comandos
//     client = app.get('NATS_SERVICE');
//     await client.connect();
//   });

//   afterAll(async () => {
//     await client.close();
//     await app.close();
//   });

//   beforeEach(() => {
//     // Limpiar mocks antes de cada test
//     jest.clearAllMocks();
//   });

//   /*-------------------------------------------------------------------------*/
//   /*----------------------------EVALUAR PUNTAJE------------------------------*/
//   /*-------------------------------------------------------------------------*/

//   describe('Evaluar Puntaje y Generar Alertas', () => {
//     it('debe generar alerta cuando el puntaje es bajo (< umbral)', async () => {
//       // Arrange
//       const puntajeDto = {
//         usuarioEmail: 'juan.perez@example.com',
//         usuarioNombre: 'Juan Pérez',
//         puntaje: 45, // Bajo (< 60)
//         descripcion: 'Paciente mostró dificultades en coherencia y fluidez',
//         umbralMinimo: 60,
//       };

//       mockEmailService.sendEmail.mockResolvedValue({
//         success: true,
//         messageId: 'test-message-id',
//       });

//       // Act
//       const response = await firstValueFrom(
//         client.send('alertas.evaluar.puntaje', puntajeDto),
//       );

//       // Assert
//       expect(response).toBeDefined();
//       expect(response.success).toBe(true);
//       expect(response.alertaEnviada).toBe(true);
//       expect(response.message).toContain('Alerta');
//       expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1);
      
//       // Verificar que se llamó con los parámetros correctos
//       const emailCall = mockEmailService.sendEmail.mock.calls[0][0];
//       expect(emailCall.type).toBe('ALERTA_PUNTAJE_BAJO');
//       expect(emailCall.params.usuarioEmail).toBe(puntajeDto.usuarioEmail);
//       expect(emailCall.params.puntaje).toBe(puntajeDto.puntaje);
//     }, 30000);

//     it('NO debe generar alerta cuando el puntaje es alto (>= umbral)', async () => {
//       // Arrange
//       const puntajeDto = {
//         usuarioEmail: 'pedro.lopez@example.com',
//         usuarioNombre: 'Pedro López',
//         puntaje: 85, // Alto (>= 60)
//         descripcion: 'Paciente mostró buena coherencia y fluidez',
//         umbralMinimo: 60,
//       };

//       // Act
//       const response = await firstValueFrom(
//         client.send('alertas.evaluar.puntaje', puntajeDto),
//       );

//       // Assert
//       expect(response).toBeDefined();
//       expect(response.success).toBe(true);
//       expect(response.alertaEnviada).toBe(false);
//       expect(response.message).toContain('no se requiere alerta');
//       expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
//     }, 30000);

//     it('debe generar alerta cuando el puntaje está justo por debajo del umbral', async () => {
//       // Arrange
//       const puntajeDto = {
//         usuarioEmail: 'carlos.ramirez@example.com',
//         usuarioNombre: 'Carlos Ramírez',
//         puntaje: 59, // Justo por debajo del umbral (60)
//         descripcion: 'Puntaje en el límite inferior',
//         umbralMinimo: 60,
//       };

//       mockEmailService.sendEmail.mockResolvedValue({
//         success: true,
//         messageId: 'test-message-id-2',
//       });

//       // Act
//       const response = await firstValueFrom(
//         client.send('alertas.evaluar.puntaje', puntajeDto),
//       );

//       // Assert
//       expect(response).toBeDefined();
//       expect(response.success).toBe(true);
//       expect(response.alertaEnviada).toBe(true);
//       expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1);
//     }, 30000);

//     it('NO debe generar alerta cuando el puntaje está exactamente en el umbral', async () => {
//       // Arrange
//       const puntajeDto = {
//         usuarioEmail: 'luis.torres@example.com',
//         usuarioNombre: 'Luis Torres',
//         puntaje: 60, // Exactamente en el umbral
//         descripcion: 'Puntaje exacto en el umbral',
//         umbralMinimo: 60,
//       };

//       // Act
//       const response = await firstValueFrom(
//         client.send('alertas.evaluar.puntaje', puntajeDto),
//       );

//       // Assert
//       expect(response).toBeDefined();
//       expect(response.success).toBe(true);
//       expect(response.alertaEnviada).toBe(false);
//       expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
//     }, 30000);

//     it('debe manejar error cuando falla el envío de email', async () => {
//       // Arrange
//       const puntajeDto = {
//         usuarioEmail: 'miguel.fernandez@example.com',
//         usuarioNombre: 'Miguel Fernández',
//         puntaje: 30, // Muy bajo
//         descripcion: 'Puntaje crítico detectado',
//         umbralMinimo: 60,
//       };

//       mockEmailService.sendEmail.mockRejectedValue(
//         new Error('Error al enviar email'),
//       );

//       // Act & Assert
//       try {
//         await firstValueFrom(
//           client.send('alertas.evaluar.puntaje', puntajeDto),
//         );
//         throw new Error('Debería haber lanzado un error');
//       } catch (error: any) {
//         expect(error).toBeDefined();
//         expect(mockEmailService.sendEmail).toHaveBeenCalled();
//       }
//     }, 30000);
//   });

//   /*-------------------------------------------------------------------------*/
//   /*---------------------------CASOS EXTREMOS--------------------------------*/
//   /*-------------------------------------------------------------------------*/

//   describe('Casos Extremos', () => {
//     it('debe manejar puntaje de 0 (mínimo)', async () => {
//       // Arrange
//       const puntajeDto = {
//         usuarioEmail: 'paciente.extremo@example.com',
//         usuarioNombre: 'Paciente Extremo',
//         puntaje: 0, // Mínimo
//         descripcion: 'Puntaje mínimo detectado',
//         umbralMinimo: 60,
//       };

//       mockEmailService.sendEmail.mockResolvedValue({
//         success: true,
//         messageId: 'test-message-id-3',
//       });

//       // Act
//       const response = await firstValueFrom(
//         client.send('alertas.evaluar.puntaje', puntajeDto),
//       );

//       // Assert
//       expect(response).toBeDefined();
//       expect(response.success).toBe(true);
//       expect(response.alertaEnviada).toBe(true);
//       expect(mockEmailService.sendEmail).toHaveBeenCalled();
//     }, 30000);

//     it('debe manejar puntaje de 100 (máximo)', async () => {
//       // Arrange
//       const puntajeDto = {
//         usuarioEmail: 'paciente.perfecto@example.com',
//         usuarioNombre: 'Paciente Perfecto',
//         puntaje: 100, // Máximo
//         descripcion: 'Puntaje perfecto',
//         umbralMinimo: 60,
//       };

//       // Act
//       const response = await firstValueFrom(
//         client.send('alertas.evaluar.puntaje', puntajeDto),
//       );

//       // Assert
//       expect(response).toBeDefined();
//       expect(response.success).toBe(true);
//       expect(response.alertaEnviada).toBe(false);
//       expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
//     }, 30000);
//   });

//   /*-------------------------------------------------------------------------*/
//   /*---------------------------FLUJO COMPLETO--------------------------------*/
//   /*-------------------------------------------------------------------------*/

//   describe('Flujo Completo E2E', () => {
//     it('debe evaluar múltiples puntajes consecutivos correctamente', async () => {
//       // Arrange - Puntaje bajo
//       const puntajeBajo = {
//         usuarioEmail: 'test.flujo1@example.com',
//         usuarioNombre: 'Test Flujo 1',
//         puntaje: 40,
//         descripcion: 'Primera evaluación con puntaje bajo',
//         umbralMinimo: 60,
//       };

//       // Arrange - Puntaje alto
//       const puntajeAlto = {
//         usuarioEmail: 'test.flujo2@example.com',
//         usuarioNombre: 'Test Flujo 2',
//         puntaje: 90,
//         descripcion: 'Segunda evaluación con puntaje alto',
//         umbralMinimo: 60,
//       };

//       mockEmailService.sendEmail.mockResolvedValue({
//         success: true,
//         messageId: 'test-flow-message',
//       });

//       // Act - Evaluar puntaje bajo
//       const response1 = await firstValueFrom(
//         client.send('alertas.evaluar.puntaje', puntajeBajo),
//       );

//       // Assert - Puntaje bajo debe generar alerta
//       expect(response1.success).toBe(true);
//       expect(response1.alertaEnviada).toBe(true);
//       expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1);

//       jest.clearAllMocks();

//       // Act - Evaluar puntaje alto
//       const response2 = await firstValueFrom(
//         client.send('alertas.evaluar.puntaje', puntajeAlto),
//       );

//       // Assert - Puntaje alto NO debe generar alerta
//       expect(response2.success).toBe(true);
//       expect(response2.alertaEnviada).toBe(false);
//       expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
//     }, 60000);
//   });
// });
