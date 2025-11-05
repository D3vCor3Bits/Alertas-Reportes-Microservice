// email.types.ts
export const EMAIL = {
  ALERTA_PUNTAJE_BAJO: "ALERTA_PUNTAJE_BAJO",
  AVISO_BASELINE: "AVISO_BASELINE",
  INVITACION_USUARIO: "INVITACION_USUARIO",
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


export interface BaselineAvisoParams {
  usuarioEmail: string
  fecha: Date
  nombrePaciente: string
  nombreDoctor: string
  sessionRecall: number
  sessionComision: number
  sessionOmision: number
  sessionCoherencia: number
  sessionFluidez: number
  sessionTotal: number
}

interface BaselineAvisoTypeParams {
  type: typeof EMAIL.AVISO_BASELINE,
  params: BaselineAvisoParams
}



export interface InvitacionUsuarioParams {
  usuarioEmail: string,
  nombreCompleto: string,
  rol: string,
  token: string

}

interface InvitacionUsuarioTypeParams {
  type: typeof EMAIL.INVITACION_USUARIO
  params: InvitacionUsuarioParams
}


export type SendEmailParams =
  | AlertaPuntajeBajoTypeParams
  | BaselineAvisoTypeParams
  | InvitacionUsuarioTypeParams;