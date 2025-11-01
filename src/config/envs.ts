import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    NATS_SERVERS: string [];
    RESEND_API_KEY: string;
    EMAIL_FROM: string;
    EMAIL_FROM_ADDRESS: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),

    NATS_SERVERS: joi.array().items(joi.string()).required(),

    // Resend configuration
    RESEND_API_KEY: joi.string().required(),
    EMAIL_FROM: joi.string().required(),
    EMAIL_FROM_ADDRESS: joi.string().email().required()
}).unknown(true);

const {error, value} = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
});

if (error){
    throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    natsServers: envVars.NATS_SERVERS,
    resendApiKey: envVars.RESEND_API_KEY,
    emailFrom: envVars.EMAIL_FROM,
    emailFromAddress: envVars.EMAIL_FROM_ADDRESS,
}