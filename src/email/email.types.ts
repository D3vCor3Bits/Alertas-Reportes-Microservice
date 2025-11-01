// email.types.ts
export const EMAIL = {
  ALERTA_PUNTAJE_BAJO: "ALERTA_PUNTAJE_BAJO",
} as const;

export interface AlertaPuntajeBajoParams {
  usuarioEmail: string;
  usuarioNombre: string;
  puntaje: number;
  descripcion: string;
  fecha: string;
  umbralMinimo: number;
}

interface AlertaPuntajeBajoTypeParams {
  type: typeof EMAIL.ALERTA_PUNTAJE_BAJO;
  params: AlertaPuntajeBajoParams;
}

// Puedes agregar más tipos de emails aquí en el futuro
export type SendEmailParams = AlertaPuntajeBajoTypeParams;
