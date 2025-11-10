// Setup de variables de entorno para testing
process.env.PORT = '3003';
process.env.NATS_SERVERS = 'nats://localhost:4222';
process.env.RESEND_API_KEY = 'test-api-key';
process.env.EMAIL_FROM = 'Test Douremember';
process.env.EMAIL_FROM_ADDRESS = 'test@douremember.com';

// Silenciar logs de NestJS en tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};
