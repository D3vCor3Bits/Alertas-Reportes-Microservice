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

# production mode
$ npm run start:prod
```

## Uso del Servicio de Alertas

### Mensaje NATS para Evaluar Puntaje

El microservicio escucha el patrón `alertas.evaluar.puntaje` y espera un payload con la siguiente estructura:

```typescript
{
  usuarioEmail: "usuario@ejemplo.com",
  usuarioNombre: "Juan Pérez",
  puntaje: 45,  // Puntaje obtenido (0-100)
  descripcion: "Una descripción de la imagen...",
  umbralMinimo: 60  // Si el puntaje es menor, se envía alerta
}
```

### Ejemplo de Uso desde otro Microservicio

```typescript
// En otro microservicio con NATS
this.client.send('alertas.evaluar.puntaje', {
  usuarioEmail: 'usuario@ejemplo.com',
  usuarioNombre: 'Juan Pérez',
  puntaje: 45,
  descripcion: 'Descripción con puntaje bajo',
  umbralMinimo: 60
}).subscribe();
```

### Respuesta del Servicio

```json
{
  "success": true,
  "message": "Alerta de puntaje bajo enviada exitosamente",
  "alertaEnviada": true
}
```

O si el puntaje es aceptable:

```json
{
  "success": true,
  "message": "Puntaje aceptable, no se requiere alerta",
  "alertaEnviada": false
}
```

## Estructura del Módulo de Email

```
src/email/
├── templates/
│   ├── layout/
│   │   ├── header.ts          # Header HTML reutilizable
│   │   └── footer.ts          # Footer HTML reutilizable
│   └── alerta-puntaje-bajo.email.ts  # Template de alerta
├── email.module.ts            # Módulo de email
├── email.service.ts           # Servicio de envío
└── email.types.ts             # Tipos y definiciones
```

## Agregar Nuevos Tipos de Email

1. Define el nuevo tipo en `email.types.ts`:
```typescript
export const EMAIL = {
  ALERTA_PUNTAJE_BAJO: "ALERTA_PUNTAJE_BAJO",
  NUEVO_TIPO: "NUEVO_TIPO", // Agregar aquí
} as const;
```

2. Crea el template en `templates/`:
```typescript
export const nuevoTipoEmail = (params) => `
  ${header('Título')}
  <div>Contenido...</div>
  ${footer()}
`;
```

3. Actualiza el servicio en `email.service.ts` para manejar el nuevo tipo.

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
