// Script de prueba para el servicio de alertas
// Ejecutar con: npx ts-node src/test-email.script.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AlertasReportesService } from './alertas-reportes/alertas-reportes.service';

async function testearEnvioEmail() {
  console.log('🚀 Iniciando prueba del servicio de alertas...\n');

  // Crear la aplicación NestJS
  const app = await NestFactory.createApplicationContext(AppModule);
  
  // Obtener el servicio
  const alertasService = app.get(AlertasReportesService);

  // Datos de prueba - MODIFICA ESTOS VALORES
  const datosPrueba = {
    usuarioEmail: 'tu-email@ejemplo.com', // 👈 CAMBIA ESTO por tu email
    usuarioNombre: 'Usuario de Prueba',
    puntaje: 45, // Puntaje bajo que activará la alerta
    descripcion: 'Esta es una descripción de prueba con un puntaje bajo que debe generar una alerta.',
    umbralMinimo: 60, // Umbral mínimo aceptable
  };

  console.log('📊 Datos de prueba:');
  console.log(JSON.stringify(datosPrueba, null, 2));
  console.log('\n⏳ Enviando alerta...\n');

  try {
    const resultado = await alertasService.generarAlertasPuntaje(datosPrueba);
    
    console.log('✅ Resultado:');
    console.log(JSON.stringify(resultado, null, 2));
    console.log('\n🎉 Prueba completada exitosamente!');
    console.log('📧 Revisa tu correo para ver el email de alerta.');
  } catch (error) {
    console.error('❌ Error durante la prueba:');
    console.error(error.message);
    console.error('\n⚠️ Verifica que:');
    console.error('1. El archivo .env está configurado correctamente');
    console.error('2. La API Key de Resend es válida');
    console.error('3. El email remitente está verificado en Resend');
  } finally {
    await app.close();
  }
}

// Ejecutar la prueba
testearEnvioEmail();
