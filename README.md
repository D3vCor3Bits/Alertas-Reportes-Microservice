<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Microservicio de Alertas y Reportes para Douremember. Este servicio se encarga de enviar notificaciones por correo electrónico cuando se detectan eventos importantes, como puntajes bajos en descripciones de imágenes.

## Características

- 📧 Envío de correos electrónicos usando Resend
- ⚠️ Sistema de alertas por puntaje bajo
- 🔌 Integración con NATS para comunicación entre microservicios
- 📝 Templates HTML personalizables para emails

## Configuración de Resend

### 1. Obtener API Key de Resend

1. Crea una cuenta en [Resend](https://resend.com/)
2. Ve a la página de API Keys
3. Crea una nueva API Key y cópiala (solo la verás una vez)
4. Guárdala de forma segura

### 2. Verificar tu Dominio

1. Ve a la página de Domains en el dashboard de Resend
2. Agrega tu dominio (ej: `tudominio.com`)
3. Sigue las instrucciones para actualizar tus registros DNS
4. Espera a que Resend verifique tu dominio (puede tomar minutos u horas)

**Nota para desarrollo:** Si no tienes un dominio verificado, puedes usar el dominio de prueba que Resend proporciona, pero solo podrás enviar emails a tu correo registrado.

### 3. Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
PORT=3003
NATS_SERVERS=nats://localhost:4222

# Configuración de Resend
RESEND_API_KEY=re_tu_api_key_aqui
EMAIL_FROM=Douremember
EMAIL_FROM_ADDRESS=notificaciones@tudominio.com
```

## Requisitos Previos

### Servidor NATS

Es **importante** tener un servidor NATS corriendo en Docker:

```bash
docker run -d --name nats-main -p 4222:4222 -p 8222:8222 nats
```

Este comando levanta un contenedor NATS que expone:
- Puerto `4222`: Para conexiones de clientes
- Puerto `8222`: Para monitoreo HTTP

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Estructura del Proyecto

```
src/
├── alertas-reportes/
│   ├── dto/                    # Data Transfer Objects
│   ├── alertas-reportes.controller.ts
│   └── alertas-reportes.service.ts
├── email/
│   ├── templates/
│   │   ├── layout/
│   │   │   ├── header.ts       # Header HTML reutilizable
│   │   │   └── footer.ts       # Footer HTML reutilizable
│   │   ├── alerta-puntaje-bajo.email.ts
│   │   ├── aviso-baseline.email.ts
│   │   ├── activacion-sesion.email.ts
│   │   └── desactivacion-sesion.email.ts
│   ├── email.module.ts         # Módulo de email
│   ├── email.service.ts        # Servicio de envío
│   └── email.types.ts          # Tipos y definiciones
├── config/
│   └── envs.ts                 # Configuración de variables de entorno
└── transports/
    └── nats.module.ts          # Configuración de NATS
```
