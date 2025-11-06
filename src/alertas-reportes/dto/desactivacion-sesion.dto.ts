import { IsDate, IsNumber, IsString } from "class-validator"

export class DesactivacionSesionDto{
    @IsString()
    usuarioEmail: string
    
    @IsString()
    nombreCompleto: string
    
    @IsNumber()
    sessionNumber: number
}