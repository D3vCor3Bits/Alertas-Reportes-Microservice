// email.types.ts
export const EMAIL = {
  ALERTA_PUNTAJE_BAJO: "ALERTA_PUNTAJE_BAJO",
} as const;

export interface AlertaPuntajeBajoParams {
  usuarioEmail: string
  nombrePaciente: string
  nombreDoctor: string
  puntaje: number
  sesion: number
  fecha: string;
  umbralMinimo: number;
}

interface AlertaPuntajeBajoTypeParams {
  type: typeof EMAIL.ALERTA_PUNTAJE_BAJO;
  params: AlertaPuntajeBajoParams;
}


export type SendEmailParams =| AlertaPuntajeBajoTypeParams;
