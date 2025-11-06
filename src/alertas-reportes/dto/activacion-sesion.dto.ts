import {IsNumber, IsString } from "class-validator"

export class ActivacionSesionDto{
    @IsString()
    usuarioEmail: string
    
    @IsString()
    nombreCompleto: string
    
    @IsNumber()
    sessionNumber: number
}