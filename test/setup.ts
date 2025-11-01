// Setup de variables de entorno para testing
process.env.PORT = '3003';
process.env.NATS_SERVERS = 'nats://localhost:4222';
process.env.RESEND_API_KEY = 'test-api-key';
process.env.EMAIL_FROM = 'Test Douremember';
process.env.EMAIL_FROM_ADDRESS = 'test@douremember.com';
