import { IsNumber, IsString } from "class-validator"


export class BaselineDto{

    @IsString()
    usuarioEmail: string

    @IsString()
    nombrePaciente: string

    @IsString()
    nombreDoctor: string

    @IsNumber()
    sessionRecall: number

    @IsNumber()
    sessionComision: number

    @IsNumber()
    sessionOmision: number

    @IsNumber()
    sessionCoherencia: number

    @IsNumber()
    sessionFluidez: number

    @IsNumber()
    sessionTotal: number
}